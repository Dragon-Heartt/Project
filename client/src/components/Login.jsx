// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

/**
 * 1) 로그인 폼에서 제출 시, FastAPI의 /auth/login 엔드포인트로 POST 요청을 보내고
 *    성공하면 { access_token, token_type }을 받아서 localStorage에 저장합니다.
 * 2) 이후 다른 API를 호출할 때는 Authorization 헤더에 localStorage 토큰을 붙여 보내게 됩니다.
 */

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ➡ 실제 FastAPI 서버의 로그인 엔드포인트 URL로 변경하세요.
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // 1) 로컬 스토리지에 토큰 저장 (Bearer 헤더용)
        localStorage.setItem('access_token', data.access_token);
        // 2) (선택) 로그인한 사용자의 이메일을 로컬 스토리지에 저장해둬도 됩니다
        localStorage.setItem('userEmail', email);

        alert('로그인 성공!');
        // 3) 로그인 후 메인 페이지(또는 원하는 페이지)로 이동
        navigate('/main');
      } else {
        // 4xx/5xx 에러 메시지가 data.detail에 담겨 있으면 보여주고, 아니면 일반 오류
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
      {/* 왼쪽 그라데이션 + 웨이브 */}
      <div className="login-wave-bg">
        <div className="login-wave-content">
          <div className="login-profile-icon">
            {/* 임시 프로필 아이콘 */}
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="22" r="12" fill="#fff" fillOpacity="0.7" />
              <ellipse cx="30" cy="45" rx="18" ry="10" fill="#fff" fillOpacity="0.5" />
            </svg>
          </div>
          <h2>Lorem ipsum</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
        </div>
        {/* SVG Wave */}
        <svg
          className="login-wave-svg"
          viewBox="0 0 320 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M320,0 Q240,100 320,200 Q240,300 320,400 Q240,500 320,500 L0,500 L0,0 Z"
            fill="#fff"
          />
        </svg>
      </div>

      {/* 오른쪽 로그인 폼 */}
      <div className="login-form-bg">
        <form className="login-form" onSubmit={handleLogin} autoComplete="off">
          <div className="login-form-title">
            <span className="login-form-avatar">
              <svg width="48" height="48" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="22" r="12" fill="#8ec6f7" />
                <ellipse cx="30" cy="45" rx="18" ry="10" fill="#8ec6f7" fillOpacity="0.5" />
              </svg>
            </span>
          </div>

          <div className="login-input-group">
            {/* 이메일 입력 */}
            <div className="login-input-wrap">
              <span className="login-input-icon">
                {/* 이메일 아이콘 */}
                <svg width="20" height="20" fill="#8ec6f7" viewBox="0 0 20 20">
                  <path d="M2 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v.217l6 4.5 6-4.5V4H4zm12 2.383l-5.445 4.084a1 1 0 0 1-1.11 0L4 6.383V16h12V6.383z" />
                </svg>
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

            {/* 비밀번호 입력 */}
            <div className="login-input-wrap">
              <span className="login-input-icon">
                {/* 비밀번호 아이콘 */}
                <svg width="20" height="20" fill="#8ec6f7" viewBox="0 0 20 20">
                  <path d="M10 2a4 4 0 0 1 4 4v2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1V6a4 4 0 0 1 4-4zm2 6V6a2 2 0 1 0-4 0v2h4zm-6 2v6h8v-6H6z" />
                </svg>
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
            <a href="#" className="login-link">
              Forgot your password?
            </a>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? '로그인 중...' : 'LOGIN'}
          </button>

          <div className="login-form-bottom">
            <span>or</span>
            <a href="/signup" className="login-link">
              Create new account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;