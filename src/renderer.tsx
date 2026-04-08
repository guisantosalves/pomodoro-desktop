// const statusEl = document.getElementById("status");
// const timerEl = document.getElementById("timer");

// // ele pega essa info do preload e atualiza o html
// (window as any).api.onTimerTick((state: string, remaining: number) => {
//   const min = Math.floor(remaining / 60)
//     .toString()
//     .padStart(2, "0");
//   const sec = (remaining % 60).toString().padStart(2, "0");

//   timerEl!.textContent = `${min}:${sec}`;

//   if (state === "idle") statusEl!.textContent = "Idle";
//   else if (state === "focus") statusEl!.textContent = "Focus";
//   else statusEl!.textContent = "Pause";
// });
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { HashRouter } from "react-router-dom/dist";
import { ToastContainer } from "./components/toast/Toast";

const root = createRoot(document.getElementById("app"));
root.render(
  <HashRouter>
    <App />
    <ToastContainer />
  </HashRouter>,
);
