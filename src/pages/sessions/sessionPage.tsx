import React, { useEffect, useState } from "react";
import { Table } from "../../components/table/Table";
import "./styles.css";

interface Session {
  id: number;
  type: string;
  duration: number;
  started_at: string;
  completed: number;
}

const columns = [
  {
    key: "type" as const,
    label: "Tipo",
    render: (value: unknown) => (
      <span
        className={`badge ${value === "focus" ? "badge-focus" : "badge-break"}`}
      >
        {value === "focus" ? "Foco" : "Pausa"}
      </span>
    ),
  },
  {
    key: "duration" as const,
    label: "Duração",
    render: (value: unknown) => {
      const secs = value as number;
      const min = Math.floor(secs / 60);
      const sec = secs % 60;
      return `${min}m ${sec > 0 ? `${sec}s` : ""}`;
    },
  },
  {
    key: "started_at" as const,
    label: "Início",
    render: (value: unknown) => {
      const date = new Date(value as string);
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    key: "completed" as const,
    label: "Status",
    render: (value: unknown) => (
      <span className={value === 1 ? "badge-completed" : "badge-incomplete"}>
        {value === 1 ? "Completa" : "Incompleta"}
      </span>
    ),
  },
];

const todayString = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const SessionPage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  const loadSessions = (day: string) => {
    (window as any).api.getSessionByDay(day).then((data: Session[]) => {
      setSessions(data);
    });
  };

  useEffect(() => {
    loadSessions(todayString());
  }, []);

  return (
    <div className="sessions-container">
      <h2>Sessões</h2>
      <Table
        columns={columns}
        data={sessions}
        emptyMessage="Nenhuma sessão registrada ainda"
        onFilter={(dateChoose) => loadSessions(dateChoose)}
      />
    </div>
  );
};
