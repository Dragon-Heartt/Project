import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuUmbrella } from "react-icons/lu";
import { LuUmbrellaOff } from "react-icons/lu";
import { TbArmchair } from "react-icons/tb";
import { TbArmchairOff } from "react-icons/tb";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";

import './Application.css';

const DEFAULT_CENTER = { lat: 36.6283, lng: 127.457 };

const SPACE_TYPES = [
  { key: true, label: '실내', icon: <div className="icon-placeholder"><TbDoorEnter/></div> },
  { key: false, label: '외부', icon: <div className="icon-placeholder"><TbDoorExit/></div> },
];
const CHAIR_TYPES = [
  { key: true, label: '의자 있음', icon: <div className="icon-placeholder"><TbArmchair/></div> },
  { key: false, label: '의자 없음', icon: <div className="icon-placeholder"><TbArmchairOff/></div> },
];
const SHADE_TYPES = [
  { key: true, label: '차양막 있음', icon: <div className="icon-placeholder"><LuUmbrella/></div> },
  { key: false, label: '차양막 없음', icon: <div className="icon-placeholder"><LuUmbrellaOff/></div> },
];

function Application({ onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: 위치, 1: 사진, 2: 공간유형, 3: 이름
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [spaceType, setSpaceType] = useState(null);
  const [hasChair, setHasChair] = useState(null);
  const [hasShade, setHasShade] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [tempLat, setTempLat] = useState(DEFAULT_CENTER.lat);
  const [tempLng, setTempLng] = useState(DEFAULT_CENTER.lng);
  const [tempAddress, setTempAddress] = useState('');
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // 지도 모달 열기
  const openMapModal = () => {
    setShowMapModal(true);
    setTimeout(() => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyATsGagEoK00aTqhbJuVKpGGKjNJdSM06Q&libraries=places`;
        script.async = true;
        script.onload = initMapModal;
        document.body.appendChild(script);
      } else {
        initMapModal();
      }
    }, 100);
  };

  // 지도 모달 닫기
  const closeMapModal = () => {
    setShowMapModal(false);
  };

  // 지도 모달 내 지도 초기화
  const initMapModal = () => {
    if (!mapRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: tempLat, lng: tempLng },
      zoom: 17,
    });
    markerRef.current = new window.google.maps.Marker({
      position: { lat: tempLat, lng: tempLng },
      map,
      draggable: true,
    });
    map.addListener('click', async (e) => {
      setTempLat(e.latLng.lat());
      setTempLng(e.latLng.lng());
      markerRef.current.setPosition(e.latLng);
      // 역지오코딩
      const addr = await getAddressFromLatLng(e.latLng.lat(), e.latLng.lng());
      setTempAddress(addr);
    });
    markerRef.current.addListener('dragend', async (e) => {
      setTempLat(e.latLng.lat());
      setTempLng(e.latLng.lng());
      const addr = await getAddressFromLatLng(e.latLng.lat(), e.latLng.lng());
      setTempAddress(addr);
    });
    // 최초 역지오코딩
    getAddressFromLatLng(tempLat, tempLng).then(setTempAddress);
  };

  // 위도/경도로 주소 얻기
  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyATsGagEoK00aTqhbJuVKpGGKjNJdSM06Q`);
      const data = await res.json();
      if (data.status === 'OK') {
        return data.results[0].formatted_address;
      }
      return '';
    } catch {
      return '';
    }
  };

  // 지도 모달에서 위치 선택 후 적용
  const handleSelectLocation = () => {
    setLat(tempLat);
    setLng(tempLng);
    setAddress(tempAddress);
    setShowMapModal(false);
  };

  // 내 위치로 이동 (지도 모달 내에서만)
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('브라우저가 위치 정보를 지원하지 않습니다.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setTempLat(pos.coords.latitude);
        setTempLng(pos.coords.longitude);
        if (markerRef.current && window.google) {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          markerRef.current.setPosition(loc);
          markerRef.current.getMap().setCenter(loc);
        }
        const addr = await getAddressFromLatLng(pos.coords.latitude, pos.coords.longitude);
        setTempAddress(addr);
        setLoading(false);
      },
      () => {
        setError('위치 정보를 가져올 수 없습니다.');
        setLoading(false);
      }
    );
  };

  // 사진 업로드
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('address', address);
      formData.append('latitude', lat);
      formData.append('longitude', lng);
      formData.append('space_type', spaceType);
      formData.append('has_chair', hasChair ? 1 : 0);
      formData.append('has_shade', hasShade ? 1 : 0);
      if (photo) formData.append('photo', photo);
      const res = await fetch('http://localhost:8000/smokingZone/smokingM', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('신청이 완료되었습니다!');
        navigate('/main');
      } else {
        setError('신청 실패');
      }
    } catch {
      setError('서버 오류');
    } finally {
      setLoading(false);
    }
  };

  // 단계별 렌더링
  const renderStep = () => {
    if (step === 0) {
      return (
        <>
          <div className="application-step-center">
            <div className="application-location-row">
              <input
                type="text"
                value={address}
                placeholder="지도에서 위치를 선택하세요"
                readOnly
                disabled
              />
              <button type="button" className="application-location-find-btn" onClick={openMapModal}>
                위치 찾기
              </button>
            </div>
            <button className="application-next-btn" type="button" onClick={() => setStep(1)} disabled={!address || !lat || !lng}>다음</button>
          </div>
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <div className="application-step-center">
            <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={loading} />
            {photoPreview && <img src={photoPreview} alt="미리보기" className="application-photo-preview" />}
            <button className="application-next-btn" type="button" onClick={() => setStep(2)} disabled={!photo}>다음</button>
          </div>
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <div className="application-step-center">
            <div className="application-card-group">
              {SPACE_TYPES.map(opt => (
                <div
                  key={opt.key}
                  className={`application-card-btn${spaceType === opt.key ? ' selected' : ''}`}
                  onClick={() => setSpaceType(opt.key)}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
            <div className="application-card-group">
              {CHAIR_TYPES.map(opt => (
                <div
                  key={String(opt.key)}
                  className={`application-card-btn${hasChair === opt.key ? ' selected' : ''}`}
                  onClick={() => setHasChair(opt.key)}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
            <div className="application-card-group">
              {SHADE_TYPES.map(opt => (
                <div
                  key={String(opt.key)}
                  className={`application-card-btn${hasShade === opt.key ? ' selected' : ''}`}
                  onClick={() => setHasShade(opt.key)}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
            <button className="application-next-btn" type="button" onClick={() => setStep(3)} disabled={!spaceType || hasChair === null || hasShade === null}>다음</button>
          </div>
        </>
      );
    }
    if (step === 3) {
      return (
        <>
          <div className="application-step-center">
            <input
              type="text"
              className="application-title-input"
              placeholder="흡연구역 이름을 입력하세요"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={30}
              required
            />
            <button className="application-btn" type="submit" disabled={!title || loading}>신청하기</button>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="application-modal-backdrop">
      <div className="application-modal">
        <button className="application-close-btn" onClick={() => navigate('/main')}>&times;</button>
        <form className="application-form" onSubmit={handleSubmit} autoComplete="off">
          {/* h2는 항상 상단에 고정 */}
          <h2 className="application-title">
            {step === 0 && '위치 선택'}
            {step === 1 && '사진 등록'}
            {step === 2 && '공간 유형 선택'}
            {step === 3 && '흡연구역 이름 입력'}
          </h2>
          {renderStep()}
          {error && <div className="application-msg error">{error}</div>}
        </form>
        {/* 지도 모달 */}
        {showMapModal && (
          <div className="application-map-modal-backdrop">
            <div className="application-map-modal">
              <button className="application-map-close-btn" onClick={closeMapModal}>&times;</button>
              <div className="application-map-modal-header">
                <button type="button" className="application-location-btn" onClick={handleCurrentLocation} disabled={loading}>내 위치</button>
                <span className="application-map-modal-address">{tempAddress}</span>
              </div>
              <div ref={mapRef} className="application-map-modal-map"></div>
              <button className="application-map-select-btn" onClick={handleSelectLocation} disabled={loading}>선택</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Application; 