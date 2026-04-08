import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/homepage/homePage";
import { SettingsPage } from "./pages/settings/settingsPage";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
};
