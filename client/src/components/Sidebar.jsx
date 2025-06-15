import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isAdmin }) => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            {isAdmin ? (
                // 관리자 화면
                <div className="admin-sidebar">
                    <h2>신청 관리</h2>
                    <div className="admin-content">
                        {/* 여기에 신청 관리 컴포넌트를 렌더링 */}
                        <ApplicationManagement />
                    </div>
                </div>
            ) : (
                // 일반 사용자 화면
                <div className="user-sidebar">
                    <div className="category-section">
                        <h2>카테고리 선택</h2>
                        {/* 기존 카테고리 선택 UI */}
                    </div>
                    <button 
                        className="apply-button"
                        onClick={() => navigate('/apply')}
                    >
                        신청하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar; 