"use client";
import React, { useState, useEffect } from "react";

interface TimerProps {
  onTimeUp: () => void;
  duration: number;
  resetTrigger: number;
}

const Timer = ({ onTimeUp, duration = 30, resetTrigger }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration); // Reset timer on new question
  }, [resetTrigger]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <div className="timer text-xl font-bold text-red-500">
      Time Left: {timeLeft}s
    </div>
  );
};

export default Timer;
