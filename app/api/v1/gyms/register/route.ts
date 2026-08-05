import { NextResponse } from "next/server";

const mockEnabled = process.env.MOCK_GYM_REGISTER === "1";

interface RegisterBody {
  gym_name?: string;
  email?: string;
  plan?: string;
}

export async function POST(request: Request) {
  if (!mockEnabled) {
    return NextResponse.json(
      {
        detail:
          "سرویس ثبت‌نام به بک‌اند وصل نیست. آدرس بک‌اند را در API_BASE_URL تنظیم کنید یا برای تست محلی MOCK_GYM_REGISTER=1 را فعال کنید.",
      },
      { status: 501 },
    );
  }

  const body = (await request.json()) as RegisterBody;

  return NextResponse.json(
    {
      gym: { name: body.gym_name, plan: body.plan },
      user: { email: body.email },
      authenticated: false,
    },
    { status: 201 },
  );
}
