import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/homepage/homePage";
import { SettingsPage } from "./pages/settings/settingsPage";
import { Sidebar } from "./components/sidebar/Sidebar";
import { SessionPage } from "./pages/sessions/sessionPage";

export const App = () => {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/sessions" element={<SessionPage />} />
      </Routes>
    </>
  );
};
