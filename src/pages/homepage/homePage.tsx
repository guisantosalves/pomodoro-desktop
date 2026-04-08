import React from "react";
import { useState, useEffect } from "react";
import "./styles.css";
import { useNavigate } from "react-router/dist";

export const HomePage = () => {
  const [time, setTime] = useState("25:00");
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(1);
  const navigate = useNavigate();

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
    status === "focus" ? "Foco" : status === "break" ? "Pausa" : "Parado";

  const startFocus = () => (window as any).api.startFocus();
  const stopTimer = () => (window as any).api.stopTimer();
  const startBreak = () => (window as any).api.startBreak();

  return (
    <div className="main-container">
      <div className="header-nav">
        <h1>MagikZub Pomodoro</h1>
        <span onClick={() => navigate("/settings")}>Settings</span>
      </div>
      <div
        className="timer-container"
        onClick={() => {
          if (status === "idle") {
            startFocus();
          } else {
            stopTimer();
          }
        }}
      >
        <svg className="progress-ring" viewBox="0 0 700 700">
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
            stroke="#2a2a2e"
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
          <text
            x="350"
            y="330"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FF8A80"
            fontSize="120"
            fontFamily="Segoe UI"
            fontWeight="600"
          >
            {time}
          </text>
          <text
            x="350"
            y="410"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FF8A80"
            fontSize="40"
            fontFamily="Segoe UI"
            fontWeight={300}
            textDecoration="uppercase"
          >
            {label}
          </text>
        </svg>
      </div>
      <div>
        <button className="btn-start-pause" onClick={() => startBreak()}>
          Iniciar Pausa
        </button>
      </div>
    </div>
  );
};
