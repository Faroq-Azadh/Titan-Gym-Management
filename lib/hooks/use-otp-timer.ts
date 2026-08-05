"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPersianDigits } from "@/lib/persian-digits";

interface UseOtpTimerOptions {
  initialSeconds?: number;
}

export function useOtpTimer({ initialSeconds = 45 }: UseOtpTimerOptions = {}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setSecondsLeft(initialSeconds);
    setCanResend(false);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, initialSeconds]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const timerLabel =
    secondsLeft > 0
      ? `ارسال مجدد تا ${toPersianDigits(
          `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`,
        )}`
      : "";

  return {
    secondsLeft,
    canResend,
    timerLabel,
    startTimer,
    resetTimer: startTimer,
  };
}
