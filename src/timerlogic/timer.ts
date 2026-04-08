export type TimerState = "idle" | "focus" | "break";

let timerState: TimerState = "idle";
let remainingSeconds = 0;
let intervalId: NodeJS.Timeout | null = null;

let focusDuration = 25 * 60;
let breakDuration = 5 * 60;

let onTick: (state: TimerState, remaining: number) => void = () => {};
let onComplete: (state: TimerState) => void = () => {};

export const setTimerCallbacks = (callbacks: {
  onTick: (state: TimerState, remaining: number) => void;
  onComplete: (state: TimerState) => void;
}): void => {
  if (callbacks.onTick) onTick = callbacks.onTick;
  if (callbacks.onComplete) onComplete = callbacks.onComplete;
};

export const setDurations = (focus: number, breakTime: number) => {
  focusDuration = focus * 60;
  breakDuration = breakTime * 60;
};

export const getDurations = () => {
  return {
    focus: focusDuration / 60,
    break: breakDuration / 60,
  };
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
  remainingSeconds = focusDuration;
  intervalId = setInterval(tick, 1000);
  onTick(timerState, remainingSeconds);
};

export const startBreak = () => {
  stopTimer();
  timerState = "break";
  remainingSeconds = breakDuration;
  intervalId = setInterval(tick, 1000);
  onTick(timerState, remainingSeconds);
};

export const getState = (): { state: TimerState; remaining: number } => ({
  state: timerState,
  remaining: remainingSeconds,
});
