import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import WelcomePage from "./components/WelcomePage";
import KakaoMap from "./components/KakaoMap";
import SidebarUI from "./components/SidebarUI";

function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/main"
          element={
            <div className="map-layout">
              <SidebarUI isOpen={isOpen} onToggle={() => setIsOpen(o => !o)} />
              <KakaoMap />
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;