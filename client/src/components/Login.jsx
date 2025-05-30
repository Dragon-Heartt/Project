import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import mainicon from '../assets/mainIcon.png'; // 지도 아이콘 경로에 맞게 수정
import homeicon from '../assets/free-icon-home-button-7606142.png'; // 홈 아이콘 경로에 맞게 수정

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [focus, setFocus] = useState({ email: false, password: false });
	const [btnActive, setBtnActive] = useState(false);

	return (
		<div className="login-bg">
			<button className="home-btn" onClick={() => navigate('/main')}>
			    <img src={homeicon} alt="home" className="home-icon" />
			</button>
			<div className="login-box">
				<h2 className="login-title">로그인</h2>
				<img src={mainicon} alt="mainicon" className="mainicon"/>
				<form className="login-form" onSubmit={e => { e.preventDefault(); }}>
					<label htmlFor="email">이메일</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						onFocus={() => setFocus(f => ({ ...f, email: true }))}
						onBlur={() => setFocus(f => ({ ...f, email: false }))}
						className={focus.email ? 'input-focus' : ''}
						autoComplete="username"
					/>
					<label htmlFor="password">비밀번호</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						onFocus={() => setFocus(f => ({ ...f, password: true }))}
						onBlur={() => setFocus(f => ({ ...f, password: false }))}
						className={focus.password ? 'input-focus' : ''}
						autoComplete="current-password"
					/>
					<button
						type="submit"
						className={`login-btn${btnActive ? ' active' : ''}`}
						onMouseDown={() => setBtnActive(true)}
						onMouseUp={() => setBtnActive(false)}
						onMouseLeave={() => setBtnActive(false)}
					>
						로그인
					</button>
				</form>
				<div className="signup-link">
					아직 회원이 아닌가요?{' '}
					<span className="link-text" onClick={() => navigate('/signup')}> 회원가입하기 </span>
				</div>
			</div>
		</div>
	);
};

export default Login;