import React, { useState, useRef } from 'react';
import './Application.css';

const DEFAULT_CENTER = { lat: 36.6283, lng: 127.457 };

function Application({ onClose }) {
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(DEFAULT_CENTER.lat);
  const [lng, setLng] = useState(DEFAULT_CENTER.lng);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [spaceType, setSpaceType] = useState('indoor');
  const [hasChair, setHasChair] = useState(false);
  const [hasShade, setHasShade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // 구글맵 스크립트 로드
  React.useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyATsGagEoK00aTqhbJuVKpGGKjNJdSM06Q&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    }
    // eslint-disable-next-line
  }, []);

  // 지도 초기화 및 마커
  const initMap = () => {
    if (!mapRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 17,
    });
    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      draggable: true,
    });
    map.addListener('click', (e) => {
      setLat(e.latLng.lat());
      setLng(e.latLng.lng());
      markerRef.current.setPosition(e.latLng);
    });
    markerRef.current.addListener('dragend', (e) => {
      setLat(e.latLng.lat());
      setLng(e.latLng.lng());
    });
  };

  // 주소 입력 후 엔터 시 Geocoding
  const handleAddressSearch = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!address) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyATsGagEoK00aTqhbJuVKpGGKjNJdSM06Q`);
        const data = await res.json();
        if (data.status === 'OK') {
          const loc = data.results[0].geometry.location;
          setLat(loc.lat);
          setLng(loc.lng);
          if (markerRef.current && window.google) {
            markerRef.current.setPosition(loc);
            markerRef.current.getMap().setCenter(loc);
          }
        } else {
          setError('주소를 찾을 수 없습니다.');
        }
      } catch {
        setError('주소 검색 오류');
      } finally {
        setLoading(false);
      }
    }
  };

  // 내 위치로 이동
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('브라우저가 위치 정보를 지원하지 않습니다.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        if (markerRef.current && window.google) {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          markerRef.current.setPosition(loc);
          markerRef.current.getMap().setCenter(loc);
        }
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
      formData.append('address', address);
      formData.append('lat', lat);
      formData.append('lng', lng);
      formData.append('space_type', spaceType);
      formData.append('has_chair', hasChair ? 1 : 0);
      formData.append('has_shade', hasShade ? 1 : 0);
      if (photo) formData.append('photo', photo);
      // 실제 API 엔드포인트로 변경 필요
      const res = await fetch('http://localhost:8000/api/apply', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('신청이 완료되었습니다!');
        onClose();
      } else {
        setError('신청 실패');
      }
    } catch {
      setError('서버 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-modal-backdrop">
      <div className="application-modal">
        <button className="application-close-btn" onClick={onClose}>&times;</button>
        <div className="application-modal-content">
          {/* 왼쪽: 신청 폼 */}
          <form className="application-form" onSubmit={handleSubmit} autoComplete="off">
            <h2>흡연구역 신청</h2>
            <label>위치(주소)</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              onKeyDown={handleAddressSearch}
              placeholder="주소를 입력하고 엔터를 누르세요"
              disabled={loading}
            />
            <label>사진 등록</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={loading} />
            {photoPreview && <img src={photoPreview} alt="미리보기" className="application-photo-preview" />}
            <label>공간 유형</label>
            <div className="application-checkbox-group">
              <label><input type="radio" name="spaceType" value="indoor" checked={spaceType==='indoor'} onChange={()=>setSpaceType('indoor')} /> 실내</label>
              <label><input type="radio" name="spaceType" value="outdoor" checked={spaceType==='outdoor'} onChange={()=>setSpaceType('outdoor')} /> 외부</label>
            </div>
            <div className="application-checkbox-group">
              <label><input type="checkbox" checked={hasChair} onChange={()=>setHasChair(v=>!v)} /> 의자 있음</label>
              <label><input type="checkbox" checked={hasShade} onChange={()=>setHasShade(v=>!v)} /> 차양막 있음</label>
            </div>
            {error && <div className="application-msg error">{error}</div>}
            <button className="application-btn" type="submit" disabled={loading}>신청하기</button>
          </form>
          {/* 오른쪽: 지도 */}
          <div className="application-map-section">
            <div className="application-map-header">
              <button type="button" className="application-location-btn" onClick={handleCurrentLocation} disabled={loading}>내 위치</button>
            </div>
            <div ref={mapRef} className="application-map"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Application; 