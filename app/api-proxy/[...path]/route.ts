import { NextRequest, NextResponse } from "next/server";

const TARGET_BACKEND = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ashkandev.ir"
).replace(/\/+$/, "");

function isJwtString(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const parts = value.split(".");
  return parts.length === 3 && parts[0].length > 10 && parts[1].length > 10;
}

function parseCookie(cookieStr: string) {
  const parts = cookieStr.split(";").map((p) => p.trim());
  const [nameValue, ...attrs] = parts;
  const eqIdx = nameValue.indexOf("=");
  if (eqIdx === -1) return null;
  const name = nameValue.slice(0, eqIdx).trim();
  let value = nameValue.slice(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  const options: {
    path?: string;
    maxAge?: number;
    expires?: Date;
    sameSite?: "lax" | "strict" | "none";
    httpOnly?: boolean;
    secure?: boolean;
  } = {
    path: "/",
    sameSite: "lax",
  };

  attrs.forEach((attr) => {
    const [attrName, ...attrValParts] = attr.split("=");
    const aName = attrName.trim().toLowerCase();
    const aVal = attrValParts.join("=").trim();

    if (aName === "path") options.path = aVal || "/";
    else if (aName === "httponly") options.httpOnly = true;
    else if (aName === "max-age") options.maxAge = parseInt(aVal, 10);
    else if (aName === "expires") options.expires = new Date(aVal);
    else if (aName === "samesite") {
      const s = aVal.toLowerCase();
      if (s === "lax" || s === "strict" || s === "none") {
        options.sameSite = s;
      }
    }
  });

  return { name, value, options };
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const pathStr = (path || []).join("/");
  const search = request.nextUrl.search || "";
  const normalizedPath = pathStr.endsWith("/") ? pathStr : `${pathStr}/`;
  const targetUrl = `${TARGET_BACKEND}/${normalizedPath}${search}`;

  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k !== "host" && k !== "connection" && k !== "content-length") {
      forwardHeaders.set(key, value);
    }
  });

  const init: RequestInit = {
    method: request.method,
    headers: forwardHeaders,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      init.body = await request.arrayBuffer();
    } catch {}
  }

  const backendResponse = await fetch(targetUrl, init);

  const rawSetCookies =
    typeof backendResponse.headers.getSetCookie === "function"
      ? backendResponse.headers.getSetCookie()
      : ([backendResponse.headers.get("set-cookie")].filter(Boolean) as string[]);

  let accessFromCookie = "";
  let refreshFromCookie = "";

  const parsedCookies: ReturnType<typeof parseCookie>[] = [];
  for (const cStr of rawSetCookies) {
    // Some runtimes join multiple cookies with commas; handle each cookie if needed
    const p = parseCookie(cStr);
    if (p) {
      parsedCookies.push(p);
      const lowerName = p.name.toLowerCase();
      if (
        lowerName === "gym_os_access" ||
        lowerName === "access" ||
        lowerName === "access_token" ||
        lowerName === "token"
      ) {
        accessFromCookie = p.value;
      } else if (
        lowerName === "gym_os_refresh" ||
        lowerName === "refresh" ||
        lowerName === "refresh_token"
      ) {
        refreshFromCookie = p.value;
      } else if (!accessFromCookie && isJwtString(p.value)) {
        // Fallback: any cookie containing a 3-part JWT
        accessFromCookie = p.value;
      }
    }
  }

  const contentType = backendResponse.headers.get("content-type") || "";
  let responseBody: any = null;

  if (contentType.includes("application/json")) {
    try {
      const json = await backendResponse.json();
      
      const foundAccess =
        json.access ||
        json.access_token ||
        json.token ||
        json.key ||
        json.tokens?.access ||
        json.data?.access ||
        accessFromCookie;

      const foundRefresh =
        json.refresh ||
        json.refresh_token ||
        json.tokens?.refresh ||
        json.data?.refresh ||
        refreshFromCookie;

      if (foundAccess) json.access = foundAccess;
      if (foundRefresh) json.refresh = foundRefresh;

      responseBody = JSON.stringify(json);
    } catch {
      responseBody = await backendResponse.text();
    }
  } else {
    responseBody = backendResponse.body;
  }

  const responseHeaders = new Headers(backendResponse.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  // Delete upstream Set-Cookie so browser doesn't reject domain mismatch (.ashkandev.ir vs localhost)
  responseHeaders.delete("set-cookie");

  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });

  // Set cookies via Next.js response.cookies on the current origin (localhost)
  for (const p of parsedCookies) {
    if (p) {
      response.cookies.set(p.name, p.value, p.options);
    }
  }

  return response;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
