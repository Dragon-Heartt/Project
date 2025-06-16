import React, { useState } from 'react';
import './SignUp.css';
import letSignUp from '../assets/SignUp4.png';


function SignUp({ onClose }) {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(null); 
  const [emailCheckMsg, setEmailCheckMsg] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [pwMatch, setPwMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const checkEmail = async () => {
    if (!email) return;
    setEmailValid(null);
    setEmailCheckMsg('');
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/auth/check-email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.available) {
        setEmailValid(true);
        setEmailCheckMsg('사용 가능한 이메일입니다.');
      } else {
        setEmailValid(false);
        setEmailCheckMsg(data.detail || '이미 사용 중인 이메일입니다.');
      }
    } catch (e) {
      setEmailValid(false);
      setEmailCheckMsg('서버 오류');
    } finally {
      setLoading(false);
    }
  };

  const handlePw2Change = (v) => {
    setPassword2(v);
    setPwMatch(password === v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!emailValid) {
      setError('이메일 중복 확인을 해주세요.');
      return;
    }
    if (!pwMatch) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(data.detail || '회원가입 실패');
      }
    } catch (e) {
      setError('서버 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-modal-backdrop">
      <div className="signup-modal">
        <button className="signup-close-btn" onClick={onClose}>&times;</button>
        <div className="signup-modal-content">
          <form className="signup-form" onSubmit={handleSubmit} autoComplete="off">
            <p className="signup-form-title">회원가입</p>
            <div className="signup-input-group">
              <label htmlFor="signup-email">이메일</label>
              <div className="signup-input-row">
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailValid(null); setEmailCheckMsg(''); }}
                  className={emailValid === false ? 'invalid' : ''}
                  placeholder="E-mail Address"
                  required
                />
                <button type="button" className="email-check-btn" onClick={checkEmail} disabled={loading || !email}>
                  중복확인
                </button>
              </div>
              {emailCheckMsg && <div className={`signup-msg ${emailValid ? 'valid' : 'invalid'}`}>{emailCheckMsg}</div>}
            </div>
            <div className="signup-input-group">
              <label htmlFor="signup-password">비밀번호</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPwMatch(e.target.value === password2); }}
                placeholder="Password"
                required
              />
            </div>
            <div className="signup-input-group">
              <label htmlFor="signup-password2">비밀번호 확인</label>
              <input
                id="signup-password2"
                type="password"
                value={password2}
                onChange={e => handlePw2Change(e.target.value)}
                placeholder="Password 확인"
                required
                className={pwMatch ? '' : 'invalid'}
              />
              {!pwMatch && <div className="signup-msg invalid">비밀번호가 일치하지 않습니다.</div>}
            </div>
            {error && <div className="signup-msg invalid">{error}</div>}
            {success && <div className="signup-msg valid">회원가입 성공! 로그인 해주세요.</div>}
            <button className="signup-btn" type="submit" disabled={loading}>회원가입</button>
          </form>
          <div className="signup-illust">
            <img src={letSignUp} className="signup-illust-img" alt="decoration" width="300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
