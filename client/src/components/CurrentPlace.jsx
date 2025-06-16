import React from "react";
import x651 from "../assets/65-1.png";
import "./CurrentPlace.css";

function CurrentPlace({ onClick }) {
  return (
    <button
      type="button"
      className="CurrentPlace"
      onClick={onClick}
      aria-label="현재 위치 보기"
    >
      <img className="element" alt="현재 위치 아이콘" src={x651} />
    </button>
  );
}

export default CurrentPlace;
