import './App.css';
import KakaoMap from './components/KakaoMap';
import SidebarUI from './components/SidebarUI';
function App() {
  return (
    <div className="container">
      <SidebarUI />
      <KakaoMap />
    </div>
  );
}

export default App;
