import React, { useState } from "react";
import "./App.css";
import KakaoMap from "./components/KakaoMap";
import SidebarUI from "./components/SidebarUI";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="container">
      <SidebarUI isOpen={isOpen} onToggle={() => setIsOpen(o => !o)} />
      <KakaoMap />
    </div>
  );
}

export default App;
