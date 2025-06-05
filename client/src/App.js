import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import GoogleMap from "./components/GoogleMap";
import SidebarUI from "./components/SidebarUI";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/main"
            element={
              <div className="map-layout">
                <SidebarUI isOpen={isOpen} onToggle={() => setIsOpen(o => !o)} />
                <GoogleMap />
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;