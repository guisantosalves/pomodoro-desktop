import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";

const dbPath = path.join(app.getPath("userData"), "pomodoro.db");
const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('focus', 'break')),
      duration INTEGER NOT NULL,
      started_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      completed INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

// settings
export const getSettings = (key: string) => {
  const row = db
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as { value: string } | undefined;

  return row ? row.value : null;
};

export const setSettings = (key: string, value: string) => {
  // it's an upsert: se a chave já existe, atualiza. Se não, insere
  db.prepare(
    "INSERT INTO settings (key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  ).run(key, value);
};

// sessions
export const saveSession = (
  type: "focus" | "break",
  duration: number,
  completed: boolean,
): void => {
  db.prepare(
    "INSERT INTO sessions (type, duration, completed) VALUES (?, ?, ?)",
  ).run(type, duration, completed ? 1 : 0);
};

export const getWeeklySessions = () => {
  return db
    .prepare(
      `
      SELECT
        date(started_at) as day,
        type,
        SUM(duration) as total_seconds,
        COUNT(*) as count
      FROM sessions
      WHERE started_at >= datetime('now', '-7 days', 'localtime')
        AND completed = 1
      GROUP BY day, type
      ORDER BY day
    `,
    )
    .all();
};

export const getSessionsByDay = (day: string) => {
  return db
    .prepare("SELECT * FROM sessions WHERE date(started_at) = ? LIMIT 60")
    .all(day);
};

export const getAllSessions = () => {
  return db
    .prepare("SELECT * FROM sessions ORDER BY started_at DESC LIMIT 50")
    .all();
};
