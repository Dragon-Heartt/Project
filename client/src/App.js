import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import SidebarUI from "./components/SidebarUI";
import GoogleMap from "./components/GoogleMap";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import MyPage from "./components/MyPage";
import Application from "./components/Application";
import CancelApplication from "./components/CancelApplication";
import ApplicationManagement from "./components/ApplicationManagement";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    spaceType: null,
    hasChair: null,
    hasShade: null
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/Application" element={<Application />} />
          <Route path="/CancelApplication" element={<CancelApplication />} />
          <Route path="/applicationManagement" element={<ApplicationManagement />} />
          <Route
            path="/main"
            element={
              <div className="map-layout">
                <SidebarUI
                  isOpen={isOpen}
                  onToggle={() => setIsOpen(prev => !prev)}
                  onFilterChange={setFilters}
                />
                <GoogleMap filters={filters} />
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