import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import mainicon from '../assets/mainIcon.png';
import homeicon from '../assets/free-icon-home-button-7606142.png';
import { authAPI } from '../services/api';
import Cookies from 'js-cookie';

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [focus, setFocus] = useState({ email: false, password: false });
	const [btnActive, setBtnActive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		console.log('🔐 로그인 시도:', email);

		try {
			const userData = { email, password };
			const response = await authAPI.login(userData);
			
			// JWT 토큰을 쿠키에 저장
			if (response.access_token) {
				Cookies.set('access_token', response.access_token, {
					expires: 1, // 1일
					secure: false, // 로컬에서는 false
					sameSite: 'lax'
				});
				
				console.log('✅ 로그인 성공, 토큰 저장됨');
				alert('로그인 성공!');
				navigate('/main');
			} else {
				setError('토큰을 받지 못했습니다.');
			}
		} catch (error) {
			console.error('❌ 로그인 실패:', error);
			setError(error.message || '로그인에 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-bg">
			<button className="home-btn" onClick={() => navigate('/')}>
			    <img src={homeicon} alt="home" className="home-icon" />
			</button>
			<div className="login-box">
				<h2 className="login-title">로그인</h2>
				<img src={mainicon} alt="mainicon" className="mainicon"/>
				
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

				<form className="login-form" onSubmit={handleSubmit}>
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
						required
						disabled={loading}
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
						required
						disabled={loading}
					/>
					<button
						type="submit"
						className={`login-btn${btnActive ? ' active' : ''}`}
						onMouseDown={() => setBtnActive(true)}
						onMouseUp={() => setBtnActive(false)}
						onMouseLeave={() => setBtnActive(false)}
						disabled={loading}
					>
						{loading ? '로그인 중...' : '로그인'}
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