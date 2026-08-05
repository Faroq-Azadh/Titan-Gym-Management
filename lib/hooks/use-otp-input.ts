"use client";

import { useCallback, useRef, useState } from "react";
import { normalizeDigits } from "@/lib/persian-digits";

const OTP_LENGTH = 5;

export function useOtpInput(length = OTP_LENGTH) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    [],
  );

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, rawValue: string) => {
      const digit = normalizeDigits(rawValue).slice(-1);

      setValues((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });

      if (digit && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [focusInput, length],
  );

  const handleKeyDown = useCallback(
    (index: number, key: string) => {
      if (key === "Backspace" && !values[index] && index > 0) {
        focusInput(index - 1);
      }
      if (key === "ArrowRight" && index < length - 1) {
        focusInput(index + 1);
      }
      if (key === "ArrowLeft" && index > 0) {
        focusInput(index - 1);
      }
    },
    [focusInput, length, values],
  );

  const handlePaste = useCallback(
    (index: number, pasted: string) => {
      const digits = normalizeDigits(pasted).slice(0, length - index).split("");
      if (digits.length === 0) return;

      setValues((prev) => {
        const next = [...prev];
        digits.forEach((digit, offset) => {
          next[index + offset] = digit;
        });
        return next;
      });

      focusInput(Math.min(index + digits.length, length - 1));
    },
    [focusInput, length],
  );

  const reset = useCallback(() => {
    setValues(Array(length).fill(""));
    focusInput(0);
  }, [focusInput, length]);

  const otpValue = values.join("");

  return {
    values,
    otpValue,
    setRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    reset,
    focusInput,
  };
}
