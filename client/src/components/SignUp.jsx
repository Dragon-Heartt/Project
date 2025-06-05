import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import freeIconHomeButton76061422 from "../assets/free-icon-home-button-7606142.png";
import freeIconNext58009281 from "../assets/free-icon-next-5800928.png";
import "./SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 처리 로직 (예: 유효성 검사, 서버 전송 등)
    alert("회원가입 시도: " + email);
  };

  return (
    <div className="frame">
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
                />
              </div>
            </div>
            <button className="div-wrapper-2" type="submit">
              <div className="text-wrapper-4">회원가입</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 