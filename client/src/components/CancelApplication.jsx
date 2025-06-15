import React, { useState } from 'react';
import './CancelApplication.css';
import { useNavigate, useLocation } from 'react-router-dom';

function CancelApplication(props) {
  const navigate = useNavigate();
  const location = useLocation();
  // state에서 우선 받고, 없으면 props fallback
  const lat = location.state?.lat ?? props.lat;
  const lng = location.state?.lng ?? props.lng;
  const zoneName = location.state?.zoneName ?? props.zoneName;
  const onSubmit = props.onSubmit;
  const onCancel = props.onCancel;

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      setError('사진을 첨부해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('latitude', String(lat));
      formData.append('longitude', String(lng));
      formData.append('photo', photo);
      formData.append('title', zoneName);
      const res = await fetch('http://localhost:8000/pinCancel/pins/cancel', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        if (onSubmit) onSubmit(formData);
        alert('취소 신청이 완료되었습니다!');
        navigate('/main');
      } else {
        const errText = await res.text();
        setError(`신청 실패: ${res.status} - ${errText}`);
      }
    } catch (err) {
      setError('신청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/main');
  };

  return (
    <div className="cancel-application-backdrop">
      <div className="cancel-application-modal">
        <button className="cancel-application-close-btn" onClick={handleClose}>&times;</button>
        <form className="cancel-application-form" onSubmit={handleSubmit} autoComplete="off">
          <h2 className="cancel-application-title">흡연구역 취소 신청</h2>
          <div className="cancel-application-info">
            <div><b>장소명:</b> {zoneName}</div>
            <div><b>위치:</b> {lat}, {lng}</div>
          </div>
          <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={loading} />
          {photoPreview && <img src={photoPreview} alt="미리보기" className="cancel-application-photo-preview" />}
          <button className="cancel-application-btn" type="submit" disabled={loading || !photo}>취소 신청하기</button>
          <button className="cancel-application-cancel-btn" type="button" onClick={onCancel} disabled={loading}>돌아가기</button>
          {error && <div className="cancel-application-msg error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default CancelApplication; 