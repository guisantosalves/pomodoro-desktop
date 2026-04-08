import React, { useState } from "react";
import { useNavigate } from "react-router/dist";
import "./sidebar.css";

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <button className="hamburger" onClick={() => setOpen(!open)}>
        <div className={`hamburger-line ${open ? "open" : ""}`} />
        <div className={`hamburger-line ${open ? "open" : ""}`} />
        <div className={`hamburger-line ${open ? "open" : ""}`} />
      </button>

      <div
        className={`sidebar-overlay ${open ? "visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      <nav className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <ul className="sidebar-links">
          <li onClick={() => goTo("/")}>Timer</li>
          <li onClick={() => goTo("/sessions")}>Sessões</li>
          <li onClick={() => goTo("/settings")}>Configurações</li>
        </ul>
      </nav>
    </>
  );
};
