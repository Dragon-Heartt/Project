import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./SidebarUI.css";

function SidebarUI() {
	const navigate = useNavigate();
	const [isExpanded, setIsExpanded] = useState(false);
	const [user, setUser] = useState(null);
	const [showCategoryBar, setShowCategoryBar] = useState(false);
	
	// 카테고리 필터 상태
	const [filters, setFilters] = useState({
		spaceType: null, // 'indoor' | 'outdoor' | null
		hasChair: null,  // true | false | null
		hasShade: null   // true | false | null
	});

	// 로그인 상태 확인
	useEffect(() => {
		const token = Cookies.get('access_token');
		if (token) {
			// JWT 토큰에서 사용자 정보 추출 (실제로는 백엔드에서 사용자 정보를 가져와야 함)
			// 여기서는 간단히 localStorage에서 사용자 이메일을 가져오거나 토큰을 디코딩
			const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
			setUser({ email: userEmail });
		} else {
			setUser(null);
		}
	}, []);

	const handleCategoryClick = () => {
		setShowCategoryBar(!showCategoryBar);
	};

	const handleFilterChange = (filterType, value) => {
		setFilters(prev => ({
			...prev,
			[filterType]: prev[filterType] === value ? null : value
		}));
	};

	const handleApplyFilters = () => {
		console.log('적용된 필터:', filters);
		// 여기서 나중에 DB 쿼리나 API 호출을 할 예정
		// 예: await fetchFilteredSmokingAreas(filters);
		alert(`필터 적용됨:\n실내/외부: ${filters.spaceType || '전체'}\n의자: ${filters.hasChair === null ? '전체' : filters.hasChair ? '있음' : '없음'}\n차양막: ${filters.hasShade === null ? '전체' : filters.hasShade ? '있음' : '없음'}`);
		
		// 적용 후 사이드바와 카테고리 바 모두 닫기
		setShowCategoryBar(false);
		setIsExpanded(false);
	};

	const handleResetFilters = () => {
		setFilters({
			spaceType: null,
			hasChair: null,
			hasShade: null
		});
	};

	const menuItems = [
		{ 
			id: 'category',
			label: '흡연구역 카테고리 선택',
			onClick: handleCategoryClick,
			icon: '📋'
		},
		{ 
			id: 'register',
			label: '흡연구역 신청',
			onClick: () => console.log('흡연구역 신청'),
			icon: '📍'
		},
		{ 
			id: 'save',
			label: '이미지 저장',
			onClick: () => console.log('이미지 저장'),
			icon: '💾'
		}
	];

	const handleProfileClick = () => {
		if (user) {
			navigate('/mypage');
		} else {
			navigate('/signin');
		}
	};

	const handleLoginClick = () => {
		navigate('/signin');
	};

	return (
		<>
			<div 
				className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
				onMouseEnter={() => setIsExpanded(true)}
				onMouseLeave={() => {
					// 카테고리 바가 열려있으면 사이드바를 닫지 않음
					if (!showCategoryBar) {
						setIsExpanded(false);
					}
				}}
			>
				<div className="sidebar-content">
					{/* 프로필 섹션 */}
					<div className="profile-section" onClick={handleProfileClick}>
						<div className="profile-icon">
							{user ? '👤' : '❓'}
						</div>
						<div className="profile-text">
							{user ? user.email : '로그인 필요'}
						</div>
					</div>

					{/* 메뉴 아이템들 */}
					{menuItems.map((item) => (
						<div 
							key={item.id}
							className={`menu-item ${item.id === 'category' && showCategoryBar ? 'active' : ''}`}
							onClick={item.onClick}
						>
							<div className="menu-icon">
								{item.icon}
							</div>
							<div className="menu-text">
								{item.label}
							</div>
						</div>
					))}

					{/* 구분선 */}
					<div className="divider"></div>

					{/* 로그인 버튼 */}
					<div className="menu-item" onClick={handleLoginClick}>
						<div className="menu-icon">
							👤
						</div>
						<div className="menu-text">
							로그인
						</div>
					</div>
				</div>
			</div>

			{/* 카테고리 선택 바 */}
			{showCategoryBar && (
				<div className="category-bar">
					<div className="category-header">
						<h3>카테고리 선택</h3>
					</div>
					
					<div className="category-content">
						{/* 실내/외부 선택 */}
						<div className="filter-group">
							<label>공간 유형</label>
							<div className="filter-options">
								<button 
									className={`filter-btn ${filters.spaceType === 'indoor' ? 'selected' : ''}`}
									onClick={() => handleFilterChange('spaceType', 'indoor')}
								>
									실내
								</button>
								<button 
									className={`filter-btn ${filters.spaceType === 'outdoor' ? 'selected' : ''}`}
									onClick={() => handleFilterChange('spaceType', 'outdoor')}
								>
									외부
								</button>
							</div>
						</div>

						{/* 의자 유무 */}
						<div className="filter-group">
							<label>의자 유무</label>
							<div className="filter-options">
								<button 
									className={`filter-btn ${filters.hasChair === true ? 'selected' : ''}`}
									onClick={() => handleFilterChange('hasChair', true)}
								>
									있음
								</button>
								<button 
									className={`filter-btn ${filters.hasChair === false ? 'selected' : ''}`}
									onClick={() => handleFilterChange('hasChair', false)}
								>
									없음
								</button>
							</div>
						</div>

						{/* 차양막 유무 */}
						<div className="filter-group">
							<label>차양막 유무</label>
							<div className="filter-options">
								<button 
									className={`filter-btn ${filters.hasShade === true ? 'selected' : ''}`}
									onClick={() => handleFilterChange('hasShade', true)}
								>
									있음
								</button>
								<button 
									className={`filter-btn ${filters.hasShade === false ? 'selected' : ''}`}
									onClick={() => handleFilterChange('hasShade', false)}
								>
									없음
								</button>
							</div>
						</div>

						{/* 버튼들 */}
						<div className="filter-actions">
							<button className="reset-btn" onClick={handleResetFilters}>
								초기화
							</button>
							<button className="apply-btn" onClick={handleApplyFilters}>
								적용
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default SidebarUI;
