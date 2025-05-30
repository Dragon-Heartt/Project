import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import freeIconOpenMenu103370951 from "../assets/free-icon-open-menu-1.png";
import polygon1 from "../assets/Polygon-1.svg";
import "./SidebarUI.css";

function SidebarUI({ isOpen, onToggle }) {
	const navigate = useNavigate();
	const [spaceType, setSpaceType] = useState(null);
	const [chairType, setChairType] = useState(null);
	const [shadeType, setShadeType] = useState(null);
	const [showCategory, setShowCategory] = useState(false);

	const menuButtons = [
		{ label: '흡연구역 신청하기', onClick: () => console.log('흡연구역 신청하기 클릭') },
		{ label: '이미지 저장', onClick: () => console.log('이미지 저장 클릭') },
		{ label: '로그인하기', onClick: () => navigate('/signin') },
	];

	return (
		<aside className={`sidebar${!isOpen ? ' closed' : ''}`}>
			<div className="frame">
				<div className="div">
					<div className="filter">
						<div className="free-icon-open-menu-wrapper">
							<img
								className="free-icon-open-menu"
								alt="Free icon open menu"
								src={freeIconOpenMenu103370951}
							/>
						</div>
						<div className="div-2">
							<div className="div-3">
								<button
									type="button"
									className={`category-toggle-btn${showCategory ? ' active' : ''}`}
									onClick={() => setShowCategory(v => !v)}
								>
									흡연구역 카테고리 선택
								</button>
								<div className={`category-slide${showCategory ? ' open' : ''}`}> 
									<div className="div-4">
										<div className="div-5">
											<div className="text-wrapper-2">공간 유형</div>
											<div className="div-6">
												<button
													type="button"
													className={`category-choice-btn${spaceType === 'indoor' ? ' selected' : ''}`}
													onClick={() => setSpaceType(spaceType === 'indoor' ? null : 'indoor')}
												>
													실내
												</button>
												<button
													type="button"
													className={`category-choice-btn${spaceType === 'outdoor' ? ' selected' : ''}`}
													onClick={() => setSpaceType(spaceType === 'outdoor' ? null : 'outdoor')}
												>
													외부
												</button>
											</div>
										</div>
										<div className="div-10">
											<div className="text-wrapper-2">의자 유무</div>
											<div className="div-11">
												<button
													type="button"
													className={`category-choice-btn${chairType === 'yes' ? ' selected' : ''}`}
													onClick={() => setChairType(chairType === 'yes' ? null : 'yes')}
												>
													있음
												</button>
												<button
													type="button"
													className={`category-choice-btn${chairType === 'no' ? ' selected' : ''}`}
													onClick={() => setChairType(chairType === 'no' ? null : 'no')}
												>
													없음
												</button>
											</div>
										</div>
										<div className="div-12">
											<div className="text-wrapper-4">차양막 유무</div>
											<div className="div-6">
												<button
													type="button"
													className={`category-choice-btn${shadeType === 'yes' ? ' selected' : ''}`}
													onClick={() => setShadeType(shadeType === 'yes' ? null : 'yes')}
												>
													있음
												</button>
												<button
													type="button"
													className={`category-choice-btn${shadeType === 'no' ? ' selected' : ''}`}
													onClick={() => setShadeType(shadeType === 'no' ? null : 'no')}
												>
													없음
												</button>
											</div>
										</div>
									</div>
									<button
										type="button"
										className="div-wrapper-2"
										onClick={() => {
											console.log("필터 적용:", { spaceType, chairType, shadeType });
										}}
									>
										<div className="text-wrapper-5">적용</div>
									</button>
								</div>
							</div>
							{menuButtons.map((btn, idx) => (
								<button
									key={btn.label}
									className="sidebar-menu-btn"
									onClick={btn.onClick}
								>
									{btn.label}
								</button>
							))}
						</div>
					</div>
					<div className="polygon-wrapper" onClick={onToggle} style={{ cursor: "pointer" }}>
						<img className="polygon" alt="Toggle sidebar" src={polygon1} />
					</div>
				</div>
			</div>
		</aside>
	);
}

export default SidebarUI;
