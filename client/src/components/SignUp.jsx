import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import freeIconHomeButton76061422 from "../assets/free-icon-home-button-7606142.png";
import freeIconNext58009281 from "../assets/free-icon-next-5800928.png";
import "./SignUp.css";
import { authAPI } from '../services/api';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('📝 회원가입 시도:', email);

    // 비밀번호 확인 검증
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    try {
      const userData = { email, password };
      await authAPI.signup(userData);
      
      console.log('회원가입 성공');
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      navigate('/signin');
    } catch (error) {
      console.error('회원가입 실패:', error);
      setError(error.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="frame-wrapper">
        <div className="free-icon-home-wrapper" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img
            className="free-icon-home"
            alt="Free icon home"
            src={freeIconHomeButton76061422}
          />
        </div>
      </div>
      <div className="body">
        <div className="div">
          <div className="div-2" style={{ cursor: 'pointer' }} onClick={() => navigate('/signin')}>
            <img
              className="free-icon-next"
              alt="Free icon next"
              src={freeIconNext58009281}
            />
            <div className="text-wrapper">로그인하기</div>
          </div>
          <div className="div-wrapper">
            <div className="text-wrapper-2">회원가입</div>
          </div>

          {error && (
            <div className="error-message" style={{
              color: '#ff4444',
              backgroundColor: '#ffe6e6',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form className="div-3" onSubmit={handleSubmit}>
            <div className="div-4">
              <div className="div-5">
                <div className="text-wrapper-3">이메일</div>
                <input
                  className="div-6"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="div-5">
                <div className="text-wrapper-3">비밀번호</div>
                <input
                  className="div-6"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
              <div className="div-5">
                <div className="text-wrapper-3">비밀번호 확인</div>
                <input
                  className="div-6"
                  type="password"
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <button className="div-wrapper-2" type="submit" disabled={loading}>
              <div className="text-wrapper-4">
                {loading ? '회원가입 중...' : '회원가입'}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 