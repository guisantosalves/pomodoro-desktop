export type TimerState = "idle" | "focus" | "break";

let timerState: TimerState = "idle";
let remainingSeconds = 0;
let intervalId: NodeJS.Timeout | null = null;

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

let onTick: (state: TimerState, remaining: number) => void = () => {};
let onComplete: (state: TimerState) => void = () => {};

export const setTimerCallbacks = (callbacks: {
  onTick: (state: TimerState, remaining: number) => void;
  onComplete: (state: TimerState) => void;
}): void => {
  if (callbacks.onTick) onTick = callbacks.onTick;
  if (callbacks.onComplete) onComplete = callbacks.onComplete;
};

export const tick = (): void => {
  remainingSeconds--;
  onTick(timerState, remainingSeconds);
  if (remainingSeconds <= 0) {
    const finishedState = timerState;
    stopTimer();
    onComplete(finishedState);
  }
};

export const stopTimer = (): void => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  timerState = "idle";
  remainingSeconds = 0;
  onTick(timerState, remainingSeconds);
};

export const startFocus = () => {
  stopTimer();
  timerState = "focus";
  remainingSeconds = FOCUS_DURATION;
  intervalId = setInterval(tick, 1000);
  onTick(timerState, remainingSeconds);
};

export const startBreak = () => {
  stopTimer();
  timerState = "break";
  remainingSeconds = BREAK_DURATION;
  intervalId = setInterval(tick, 1000);
  onTick(timerState, remainingSeconds);
};

export const getState = (): { state: TimerState; remaining: number } => ({
  state: timerState,
  remaining: remainingSeconds,
});
