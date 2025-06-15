import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import SignUp from './SignUp';
import { FaUserAstronaut } from "react-icons/fa6";
import { IoKeyOutline, IoMailOutline } from "react-icons/io5";


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAdmin', data.is_admin);  

        alert('로그인 성공!');
        navigate('/main');
      } else {
        alert(data.detail || '로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('서버 요청 중 에러 발생:', err);
      alert('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-wave-bg color-change-2x">
        <div className="login-wave-content">
          <h2>내 주변 흡연구역을 한눈에!</h2>
          <h3>로그인하고 시작하세요</h3>
          <p>국민건강증진법 제9조에 따라 학교·의료기관·관공서·대중교통 등 공공장소는 모두 금연구역입니다.</p>
          <p>위반 시 흡연자에게 10만원 이하 과태료가 부과됩니다.</p>
        </div>
    </div>
	<div >
		<svg
          className="login-wave-border"
          viewBox="0 0 170 200"
          preserveAspectRatio="none"
        >
          	<path className="color-change" d="M0,0 C33,5 80,15 86,25 C95,50 10,50 2,80 C5,110 170,110 170,140 C160,165 18,175 10,200 L0,200 Z" fill="#4dd8ff">
    			<animate 
      				attributeName="d"
      				dur="20s" 
      				repeatCount="indefinite"
      				values="
        				M0,0 C33,5 80,15 86,25 C95,50 10,50 2,80 C5,110 170,110 170,140 C160,165 18,175 10,200 L0,200 Z;
                		M0,0 C31,6 82,16 88,22 C93,45 12,48 4,84 C7,112 168,112 168,142 C158,167 16,180 8,200 L0,200 Z;
                		M0,0 C35,4 78,18 84,28 C97,55 8,52 0,82 C3,113 172,115 171,137 C161,162 20,178 12,200 L0,200 Z;
               		    M0,0 C29,8 81,13 85,23 C94,48 11,50 3,79 C6,109 169,109 169,139 C159,166 18,176 10,200 L0,200 Z;
                		M0,0 C34,7 79,17 87,26 C98,60 9,54 2,85 C5,115 171,118 170,141 C160,168 17,182 9,202 L0,202 Z;
                		M0,0 C33,3 83,14 88,27 C96,52 10,53 1,81 C4,111 170,114 168,139 C158,164 19,174 11,200 L0,196 Z;
               		    M0,0 C30,5 80,15 86,25 C95,50 10,50 2,80 C5,110 170,110 170,140 C160,165 18,175 10,200 L0,200 Z;
                		M0,0 C32,10 84,20 89,30 C99,58 12,56 6,88 C8,118 173,120 172,145 C162,172 21,185 13,205 L0,205 Z;
                		M0,0 C28,6 76,12 82,22 C92,46 8,46 0,78 C2,108 166,108 166,136 C156,162 14,172 6,198 L0,200 Z;
                		M0,0 C36,9 85,19 90,29 C100,62 14,58 8,90 C10,122 175,122 174,147 C164,174 23,187 15,207 L0,207 Z;
                		M0,0 C30,7 78,16 84,24 C94,49 9,51 1,82 C3,110 168,112 168,141 C158,165 17,178 10,201 L0,201 Z;
                		M0,0 C33,4 81,15 88,26 C97,56 11,54 5,83 C7,117 171,116 169,143 C159,169 20,182 12,203 L0,203 Z;
                		M0,0 C29,8 79,11 87,21 C91,44 7,45 3,77 C4,105 167,105 167,133 C157,160 15,170 9,200 L0,200 Z;
                		M0,0 C35,6 83,18 89,28 C98,59 13,57 7,86 C9,120 173,118 171,146 C163,175 22,189 14,208 L0,208 Z;
                		M0,0 C31,5 77,17 85,27 C95,53 10,52 2,81 C5,113 169,114 169,140 C159,167 18,176 11,200 L0,200 Z;
                		M0,0 C34,8 80,14 87,23 C93,47 9,49 1,80 C4,109 168,111 168,139 C158,163 16,172 10,200 L0,200 Z;
                		M0,0 C32,6 78,16 86,25 C95,50 10,50 2,80 C5,110 170,110 170,140 C160,165 18,175 10,200 L0,200 Z;
                		M0,0 C33,5 80,15 86,25 C95,50 10,50 2,80 C5,110 170,110 170,140 C160,165 18,175 10,200 L0,200 Z;
                		M0,0 C30,9 82,14 88,28 C98,57 12,52 4,86 C6,118 172,116 170,143 C160,167 19,181 11,202 L0,202 Z;
                		M0,0 C33,5 80,15 86,25 C95,50 10,50 2,80 C5,110 170,110 170,140 C160,165 18,175 10,200 L0,200 Z
      				"
    			/>
  			</path>
    	</svg>
	</div>
      	<div className="login-form-bg">
        	<form className="login-form" onSubmit={handleLogin} autoComplete="off">
          	<div className="login-form-title">
              <div className="login-icon">
                <FaUserAstronaut />
              </div>
            </div>

          <div className="login-input-group">
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <IoMailOutline />
              </span>
              <input
                type="email"
                className="login-input"
                placeholder="E-mail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="login-input-wrap">
              <span className="login-input-icon">
                <IoKeyOutline />
              </span>
              <input
                type="password"
                className="login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-form-links">
            <a href="reset-password" className="login-link">
              비밀번호를 까먹었나요?
            </a>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? '로그인 중...' : 'LOGIN'}
          </button>

          <div className="login-form-bottom">
            <button type="button" className="login-link" onClick={() => setShowSignUp(true)}>
              회원가입
            </button>
          </div>
        </form>
      </div>
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} />}
    </div>
  );
}

export default Login;