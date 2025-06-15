import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./SidebarUI.css";
import { BiUser } from "react-icons/bi";
import { BiCheckSquare } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import { BiDownload } from "react-icons/bi";
import { FiLogIn } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { IoInformationCircleOutline } from "react-icons/io5";

function SidebarUI() {
	const navigate = useNavigate();
	const [isExpanded, setIsExpanded] = useState(false);
	const [user, setUser] = useState(null);
	const [showCategoryBar, setShowCategoryBar] = useState(false);
	const [showMarkerInfo, setShowMarkerInfo] = useState(false);
	
	const [filters, setFilters] = useState({
		spaceType: null,
		hasChair: null,
		hasShade: null
	});

	useEffect(() => {
		const token = localStorage.getItem('access_token');
		if (token) {
			const userEmail = localStorage.getItem('userEmail');
			if (userEmail) {
				setUser({ email: userEmail });
			} else {
				setUser(null);
			}
		} else {
			setUser(null);
		}
	}, []);
	const handleLogout = () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('userEmail');
		setUser(null);
		navigate('/signin');
	};

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
		alert(`필터 적용됨:\n실내/외부: ${filters.spaceType || '전체'}\n의자: ${filters.hasChair === null ? '전체' : filters.hasChair ? '있음' : '없음'}\n차양막: ${filters.hasShade === null ? '전체' : filters.hasShade ? '있음' : '없음'}`);
		
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

	const handleRegisterClick = () => {
		const token = localStorage.getItem('access_token');
		if (!token) {
			alert('로그인 후 이용 가능한 기능입니다.');
			navigate('/signin');
			return;
		}
		navigate('/Application');
	};

	const menuItems = [
		{ 
			id: 'category',
			label: '흡연구역 카테고리 선택',
			onClick: handleCategoryClick,
			icon: <BiCheckSquare />
		},
		{ 
			id: 'register',
			label: '흡연구역 신청',
			onClick: handleRegisterClick,
			icon: <BiEdit />
		},
		{
			id: 'marker-info',
			label: '마커 색상 안내',
			onClick: () => setShowMarkerInfo(!showMarkerInfo),
			icon: <IoInformationCircleOutline />
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
					if (!showCategoryBar && !showMarkerInfo) {
						setIsExpanded(false);
					}
				}}
			>
				<div className="sidebar-content">
					<div className="profile-section" onClick={handleProfileClick}>
						<div className="profile-icon">
							<BiUser />
						</div>
						<div className="profile-text">
							{user ? user.email : '로그인 필요'}
						</div>
					</div>

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

					{user 
						? <div className="menu-item" onClick={handleLogout}>
							<div className="menu-icon"><LuLogOut /></div>
							<div className="menu-text">로그아웃</div>
						</div>
						: <div className="menu-item" onClick={handleLoginClick}>
							<div className="menu-icon"><FiLogIn /></div>
							<div className="menu-text">로그인</div>
						</div>
					}
				</div>
			</div>

			{showCategoryBar && (
				<div className="category-bar">
					<div className="category-header">
						<h3>카테고리 선택</h3>
					</div>
					
					<div className="category-content">
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

			{showMarkerInfo && (
				<div className="marker-info-popup">
					<div className="marker-info-header">
						<h3>마커 색상 안내</h3>
					</div>
					<div className="marker-info-content">
						<div className="marker-info-item">
							<div className="marker-color blue"></div>
							<span>실내 + 의자 + 차양막</span>
						</div>
						<div className="marker-info-item">
							<div className="marker-color yellow"></div>
							<span>실내 + 의자</span>
						</div>
						<div className="marker-info-item">
							<div className="marker-color green"></div>
							<span>실내 + 차양막</span>
						</div>
						<div className="marker-info-item">
							<div className="marker-color red"></div>
							<span>실내</span>
						</div>
						<div className="marker-info-item">
							<div className="marker-color purple"></div>
							<span>실외</span>
						</div>
						<div className="marker-info-item">
							<div className="marker-color orange"></div>
							<span>실외 + 차양막</span>
						</div>
						<div className="marker-info-item">
							<div className="marker-color pink"></div>
							<span>실외 + 의자</span>
						</div>
						<div className="marker-info-item">
							<div className="marker-color brown"></div>
							<span>실외 + 의자 + 차양막</span>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default SidebarUI;
