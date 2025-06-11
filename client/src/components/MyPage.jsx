import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const MyPage = () => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail');

    const handleLogout = () => {
        // 토큰과 사용자 정보 삭제
        Cookies.remove('access_token');
        localStorage.removeItem('userEmail');
        
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    if (!userEmail) {
        navigate('/signin');
        return null;
    }

    return (
        <div style={{
            padding: '50px',
            textAlign: 'center',
            fontFamily: 'Pretendard, sans-serif'
        }}>
            <h1>마이페이지</h1>
            <div style={{
                background: '#DAEFFF',
                padding: '30px',
                borderRadius: '15px',
                margin: '20px 0',
                maxWidth: '400px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <h3>사용자 정보</h3>
                <p><strong>이메일:</strong> {userEmail}</p>
            </div>
            
            <div style={{ marginTop: '30px' }}>
                <button 
                    onClick={() => navigate('/main')}
                    style={{
                        background: '#4dabf7',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        marginRight: '10px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    지도로 돌아가기
                </button>
                <button 
                    onClick={handleLogout}
                    style={{
                        background: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    로그아웃
                </button>
            </div>
        </div>
    );
};

export default MyPage; 