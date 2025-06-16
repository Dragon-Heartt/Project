import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isAdmin }) => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            {isAdmin ? (
                <div className="admin-sidebar">
                    <h2>신청 관리</h2>
                    <div className="admin-content">
                        <ApplicationManagement />
                    </div>
                </div>
            ) : (
                <div className="user-sidebar">
                    <div className="category-section">
                        <h2>카테고리 선택</h2>
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