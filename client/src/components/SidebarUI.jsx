// src/components/SidebarUI.jsx
import './SidebarUI.css';

function SidebarUI() {
  return (
    <div className="sidebar">
      <h4>흡연구역 카테고리 선택</h4>
      <div>
        <label><input type="checkbox" /> 실내</label>
        <label><input type="checkbox" /> 외부</label>
      </div>
      <div>
        <label><input type="checkbox" /> 의자 있음</label>
        <label><input type="checkbox" /> 없음</label>
      </div>
      <div>
        <label><input type="checkbox" /> 차양막 있음</label>
        <label><input type="checkbox" /> 없음</label>
      </div>
      <button>적용</button>
      <button>흡연구역 신청하기</button>
      <button>이미지 저장</button>
      <button>로그인하기</button>
    </div>
  );
}

export default SidebarUI;