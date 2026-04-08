import React, { useRef } from "react";
import { useState, useEffect } from "react";
import "./styles.css";
import { useNavigate } from "react-router/dist";

export const HomePage = () => {
  const [time, setTime] = useState("25:00");
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(1);
  const totalRef = useRef(25 * 60);
  const navigate = useNavigate();

  useEffect(() => {
    (window as any).api.onTimerTick((state: string, remaining: number) => {
      const min = Math.floor(remaining / 60)
        .toString()
        .padStart(2, "0");
      const sec = (remaining % 60).toString().padStart(2, "0");
      setTime(`${min}:${sec}`);
      setStatus(state);

      if (state === "idle") {
        setProgress(1);
        totalRef.current = 0;
      } else {
        if (totalRef.current === 0) {
          totalRef.current = remaining;
        }
        setProgress(remaining / totalRef.current);
      }
    });
  }, []);

  useEffect(() => {
    (window as any).api
      .getDurations()
      .then((data: { focus: number; break: number }) => {
        setTime(`${data.focus.toString().padStart(2, "0")}:00`);
        totalRef.current = data.focus * 60;
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
        <span onClick={() => navigate("/settings")}>Configurações</span>
      </div>
      <div
        className="timer-container"
        onClick={() => {
          if (status === "idle") startFocus();
          else stopTimer();
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
            strokeWidth="20"
          />
          <circle
            cx="350"
            cy="350"
            r={radius}
            fill="none"
            stroke="#FF8A80"
            strokeWidth="20"
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
            y="320"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FF8A80"
            fontSize="110"
            fontFamily="Segoe UI"
            fontWeight="300"
          >
            {time}
          </text>
          <text
            x="350"
            y="400"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#666"
            fontSize="36"
            fontFamily="Segoe UI"
            fontWeight="300"
            letterSpacing="4"
          >
            {label.toUpperCase()}
          </text>
        </svg>
      </div>
      <div className="actions">
        {status === "idle" ? (
          <button className="btn-primary" onClick={() => startFocus()}>
            Iniciar Foco
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => stopTimer()}>
            Parar
          </button>
        )}
        <button className="btn-secondary" onClick={() => startBreak()}>
          Pausa
        </button>
      </div>
    </div>
  );
};
