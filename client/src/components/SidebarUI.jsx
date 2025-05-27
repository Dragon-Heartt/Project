import React, { useState } from "react";
import freeIconOpenMenu103370951 from "../assets/free-icon-open-menu-10337095-1.png";
import polygon1 from "../assets/Polygon-1.svg";
import "./SidebarUI.css";

function SidebarUI({ isOpen, onToggle }) {

  const [spaceType, setSpaceType] = useState(null);
  const [chairType, setChairType] = useState(null);
  const [shadeType, setShadeType] = useState(null);

  return (
    <aside className={`sidebar ${!isOpen ? "closed" : ""}`}>
      {/* 프레임 내부 마크업은 그대로 유지 */}

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
                <div className="div-wrapper">
                  <div className="text-wrapper">
                    흡연구역 카테고리 선택
                  </div>
                </div>

                <div className="div-4">
                  <div className="div-5">
                    <div className="text-wrapper-2">공간 유형</div>
                    <div className="div-6">
                      {/* 실내 */}
                      <div
                        className="div-7"
                        onClick={() =>
                          setSpaceType(prev => (prev === "indoor" ? null : "indoor"))
                        }
                      >
                        <div className="text-wrapper-3">실내</div>
                        <div
                          className={
                            spaceType === "indoor" ? "div-8 checked" : "div-8"
                          }
                        />
                      </div>

                      {/* 외부 */}
                      <div
                        className="div-7"
                        onClick={() =>
                          setSpaceType(prev => (prev === "outdoor" ? null : "outdoor"))
                        }
                      >
                        <div className="text-wrapper-3">외부</div>
                        <div
                          className={
                            spaceType === "outdoor" ? "div-8 checked" : "div-8"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="div-10">
                    <div className="text-wrapper-2">의자 유무</div>
                    <div className="div-11">
                      {/* 있음 */}
                      <div
                        className="div-7"
                        onClick={() =>
                          setChairType(prev => (prev === "yes" ? null : "yes"))
                        }
                      >
                        <div className="text-wrapper-3">있음</div>
                        <div className={
                          chairType === "yes" ? "div-8 checked" : "div-8"
                        } />
                      </div>
                      {/* 없음 */}
                      <div
                        className="div-7"
                        onClick={() =>
                          setChairType(prev => (prev === "no" ? null : "no"))
                        }
                      >
                        <div className="text-wrapper-3">없음</div>
                        <div className={
                          chairType === "no" ? "div-8 checked" : "div-8"
                        } />
                      </div>
                    </div>
                  </div>

                  {/* 차양막 유무 */}
                  <div className="div-12">
                    <div className="text-wrapper-4">차양막 유무</div>
                    <div className="div-6">
                      {/* 있음 */}
                      <div
                        className="div-7"
                        onClick={() =>
                          setShadeType(prev => (prev === "yes" ? null : "yes"))
                        }
                      >
                        <div className="text-wrapper-3">있음</div>
                        <div className={
                          shadeType === "yes" ? "div-8 checked" : "div-8"
                        } />
                      </div>
                      {/* 없음 */}
                      <div
                        className="div-7"
                        onClick={() =>
                          setShadeType(prev => (prev === "no" ? null : "no"))
                        }
                      >
                        <div className="text-wrapper-3">없음</div>
                        <div className={
                          shadeType === "no" ? "div-8 checked" : "div-8"
                        } />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="div-wrapper-2"
                  onClick={() => {
                    // TODO: '적용' 로직 넣기
                    console.log("필터 적용:", { spaceType, chairType, shadeType });
                  }}
                >
                  <div className="text-wrapper-5">적용</div>
                </button>
              </div>

              <button
                type="button"
                className="div-wrapper"
                onClick={() => console.log("흡연구역 신청하기 클릭")}
              >
                <div className="text-wrapper">흡연구역 신청하기</div>
              </button>
              <button
                type="button"
                className="div-wrapper"
                onClick={() => console.log("이미지 저장 클릭")}
              >
                <div className="text-wrapper">이미지 저장</div>
              </button>
              <button
                type="button"
                className="div-wrapper"
                onClick={() => console.log("로그인하기 클릭")}
              >
                <div className="text-wrapper">로그인하기</div>
              </button>
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
