import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';
import dragon2 from '../assets/welcome1.png';
import dragon1 from '../assets/welcome2.png';
import dragon3 from '../assets/welcome3.png';
import dragon4 from '../assets/welcome4.png';
import dragon5 from '../assets/welcome5.png';
import dragon6 from '../assets/welcome6.png';
import dragon7 from '../assets/welcome7.png';
import dragon8 from '../assets/welcome8.png';

const HighlightText = ({ children }) => {
    const ref = useRef();
    const [pos, setPos] = useState({ x: 0, y: 0, active: false });

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        setPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            active: true
        });
    };
    const handleMouseLeave = () => {
        setPos((p) => ({ ...p, active: false }));
    };
    return (
        <span
            ref={ref}
            className="highlight-font mouse-glow"
            style={pos.active ? { '--x': `${pos.x}px`, '--y': `${pos.y}px` } : {}}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </span>
    );
};

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleMapClick = () => {
        navigate('/main');
    };

    return (
        <div className="container">
            <div className="top-right-buttons">
                <button className="sign-button" onClick={() => navigate('/signup')}>Sign Up</button>
                <button className="sign-button" onClick={() => navigate('/signin')}>Sign In</button>
            </div>
            <div className="welcome-text">
                <HighlightText>흡연구역 찾느라 헤매신 적 있나요?</HighlightText><br />
                <HighlightText>지정 외 구역에서의 흡연으로 불편을 겪으신 적 있으신가요?</HighlightText><br /><br />
                이제 여러분의 참여로 완벽한 흡연 구역 지도가 완성됩니다.<br />
                주변 흡연구역을 신청하고, 모두와 공유해보세요!
            </div>
            <button className="map-button" onClick={handleMapClick}>지도 보러가기</button>
            <div className="floating-elements">
                <img src={dragon1} className="floating-element element1" alt="decoration" width="120" />
                <img src={dragon2} className="floating-element element2" alt="decoration" width="120" />
                <img src={dragon3} className="floating-element element4" alt="decoration" width="190" />
                <img src={dragon4} className="floating-element element3" alt="decoration" width="180" />
                <img src={dragon5} className="floating-element element5" alt="decoration" width="200" />
                <img src={dragon6} className="floating-element element6" alt="decoration" width="150" />
                <img src={dragon7} className="floating-element element7" alt="decoration" width="75" />
                <img src={dragon8} className="floating-element element8" alt="decoration" width="100" />
            </div>
        </div>
    );
};

export default WelcomePage; 