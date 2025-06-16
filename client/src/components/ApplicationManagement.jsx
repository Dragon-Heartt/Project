import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApplicationManagement.css';

const ApplicationManagement = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('apply');
    const [applications, setApplications] = useState([]);
    const [cancelApplications, setCancelApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyError, setApplyError] = useState(null);
    const [cancelError, setCancelError] = useState(null);

    useEffect(() => {
        fetchApplications();
        fetchCancelApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        setApplyError(null);
        try {
            const response = await fetch('http://localhost:8000/map/pins/pending');
            if (!response.ok) throw new Error('신청 목록을 불러오지 못했습니다.');
            const data = await response.json();
            setApplications(Array.isArray(data) ? data : []);
        } catch (e) {
            setApplyError(e.message);
            setApplications([]);
        }
        setLoading(false);
    };

    const fetchCancelApplications = async () => {
        setCancelError(null);
        try {
            const response = await fetch('http://localhost:8000/admin/cancel-requests');
            if (!response.ok) throw new Error('취소 신청 목록을 불러오지 못했습니다.');
            const data = await response.json();
            setCancelApplications(Array.isArray(data) ? data : []);
        } catch (e) {
            setCancelError(e.message);
            setCancelApplications([]);
        }
    };

    const handleApprove = async (index) => {
        try {
            const response = await fetch(`http://localhost:8000/admin/approve/${index}`, { method: 'PUT' });
            if (!response.ok) throw new Error('수락에 실패했습니다.');
            fetchApplications();
        } catch (e) {
            alert(e.message);
        }
    };

    const handleCancelApprove = async (index) => {
        try {
            const response = await fetch(`http://localhost:8000/admin/cancel-approve/${index}`, { method: 'PUT' });
            if (!response.ok) throw new Error('취소 수락에 실패했습니다.');
            fetchCancelApplications();
            fetchApplications(); 
        } catch (e) {
            alert(e.message);
        }
    };

    const handleCancelReject = async (index) => {
        try {
            const response = await fetch(`http://localhost:8000/admin/cancel-reject/${index}`, { method: 'PUT' });
            if (!response.ok) throw new Error('취소 반려에 실패했습니다.');
            fetchCancelApplications();
        } catch (e) {
            alert(e.message);
        }
    };

    const handleReject = async (index) => {
        try {
            const response = await fetch(`http://localhost:8000/admin/reject/${index}`, { method: 'PUT' });
            if (!response.ok) throw new Error('반려에 실패했습니다.');
            fetchApplications();
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <div className="application-management">
            <div className="application-header">
                <button
                    onClick={() => navigate('/main')}
                    className="back-button"
                    aria-label="메인으로 돌아가기"
                >
                    ← 지도로 돌아가기
                </button>
                <div style={{ flex: 1 }} />
            </div>

            <div className="tab-container">
                <button
                    onClick={() => setTab('apply')}
                    className={`tab-button ${tab === 'apply' ? 'active' : ''}`}
                >
                    신청 목록
                </button>
                <button
                    onClick={() => setTab('cancel')}
                    className={`tab-button ${tab === 'cancel' ? 'active' : ''}`}
                >
                    취소 신청 목록
                </button>
            </div>

            {tab === 'apply' && (
                <div>
                    {applyError ? (
                        <div className="error-message">{applyError}</div>
                    ) : applications.length === 0 ? (
                        <div>신청 내역이 없습니다.</div>
                    ) : (
                        applications.map((app) => (
                            <div key={app.fileIndex} className="application-card">
                                {app.photo_url && (
                                    <div className="application-image-wrap">
                                        <img src={`http://localhost:8000${app.photo_url}`} alt={app.title} className="application-image" />
                                    </div>
                                )}
                                <div>제목: {app.title || '-'}</div>
                                <div>위치: {app.latitude}, {app.longitude}</div>
                                <div>상태: {app.approved ? '수락됨' : '대기중'}</div>
                                {!app.approved && (
                                    <div className="button-group">
                                        <button className="approve-button" onClick={() => handleApprove(app.fileIndex)}>수락</button>
                                        <button className="reject-button" onClick={() => handleReject(app.fileIndex)}>반려</button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {tab === 'cancel' && (
                <div>
                    {cancelError ? (
                        <div className="error-message">{cancelError}</div>
                    ) : cancelApplications.length === 0 ? (
                        <div>취소 신청 내역이 없습니다.</div>
                    ) : (
                        cancelApplications.map((app) => (
                            <div key={app.fileIndex} className="application-card">
                                {app.photo_url && (
                                    <div className="application-image-wrap">
                                        <img src={`http://localhost:8000${app.photo_url}`} alt={app.title} className="application-image" />
                                    </div>
                                )}
                                <div>제목: {app.title || '-'}</div>
                                <div>위치: {app.latitude}, {app.longitude}</div>
                                <div className="button-group">
                                    <button className="approve-button" onClick={() => handleCancelApprove(app.fileIndex)}>수락</button>
                                    <button className="reject-button" onClick={() => handleCancelReject(app.fileIndex)}>반려</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ApplicationManagement; 