import React from "react";
import { useState, useEffect } from "react";
import "./index.css";

export const App = () => {
  const [time, setTime] = useState("25:00");
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    (window as any).api.onTimerTick((state: string, remaining: number) => {
      const min = Math.floor(remaining / 60)
        .toString()
        .padStart(2, "0");
      const sec = (remaining % 60).toString().padStart(2, "0");
      setTime(`${min}:${sec}`);
      setStatus(state);

      const total = state === "break" ? 5 * 60 : 25 * 60;
      setProgress(state === "idle" ? 1 : remaining / total);
    });
  }, []);

  const radius = 335;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const label =
    status === "focus" ? "Foco" : status === "break" ? "Pausa" : "Idle";

  return (
    <div className="main-container">
      <div className="timer-container">
        <svg className="progress-ring" width="700" height="700">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="350"
            cy="350"
            r={radius}
            fill="none"
            stroke="#FF8A80"
            strokeWidth="25"
          />
          <circle
            cx="350"
            cy="350"
            r={radius}
            fill="none"
            stroke="#FF8A80"
            strokeWidth="25"
            strokeLinecap="round"
            transform="rotate(-90 350 350)"
            filter="url(#glow)"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.5s ease",
            }}
          />
        </svg>
        <div className="timer-text-container">
          <div className="timer-text">
            <p
              id="timer"
              style={{
                padding: 0,
                margin: 0,
                fontSize: "8rem",
                color: "#FF8A80",
              }}
            >
              {time}
            </p>
            <p
              id="status"
              style={{
                padding: 0,
                margin: 0,
                fontSize: "2rem",
                color: "#FF8A80",
              }}
            >
              {label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
