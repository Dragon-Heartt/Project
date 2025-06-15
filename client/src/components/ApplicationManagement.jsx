import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApplicationManagement.css';

const ApplicationManagement = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('apply'); // 'apply' or 'cancel'
    const [applications, setApplications] = useState([]);
    const [cancelApplications, setCancelApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyError, setApplyError] = useState(null);
    const [cancelError, setCancelError] = useState(null);

    useEffect(() => {
        fetchApplications();
        fetchCancelApplications();
    }, []);

    // 신청 목록: txt 기반 승인대기 목록과 일치시키기 위해 /map/pins/pending 사용
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

    // 신청 승인
    const handleApprove = async (index) => {
        try {
            const response = await fetch(`http://localhost:8000/admin/approve/${index}`, { method: 'PUT' });
            if (!response.ok) throw new Error('승인에 실패했습니다.');
            fetchApplications();
        } catch (e) {
            alert(e.message);
        }
    };

    // 취소 승인
    const handleCancelApprove = async (index) => {
        try {
            const response = await fetch(`http://localhost:8000/admin/cancel-approve/${index}`, { method: 'PUT' });
            if (!response.ok) throw new Error('취소 승인에 실패했습니다.');
            fetchCancelApplications();
            fetchApplications(); // 핀 목록도 갱신
        } catch (e) {
            alert(e.message);
        }
    };

    // 취소 거절
    const handleCancelReject = async (index) => {
        try {
            const response = await fetch(`http://localhost:8000/admin/cancel-reject/${index}`, { method: 'PUT' });
            if (!response.ok) throw new Error('취소 거절에 실패했습니다.');
            fetchCancelApplications();
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <div className="application-management">
            {/* 홈(메인)으로 돌아가기 버튼 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <button
                    onClick={() => navigate('/main')}
                    style={{
                        marginRight: 16,
                        background: 'none',
                        border: 'none',
                        fontSize: 20,
                        cursor: 'pointer',
                        color: '#1976d2',
                        fontWeight: 'bold',
                        padding: 0
                    }}
                    aria-label="메인으로 돌아가기"
                >
                    ⬅ 홈
                </button>
                <div style={{ flex: 1 }} />
            </div>

            {/* 상단 탭 */}
            <div style={{ display: 'flex', borderBottom: '1px solid #ccc', marginBottom: 20 }}>
                <button
                    onClick={() => setTab('apply')}
                    style={{
                        fontWeight: tab === 'apply' ? 'bold' : 'normal',
                        border: 'none',
                        background: 'none',
                        padding: '10px 20px',
                        borderBottom: tab === 'apply' ? '2px solid #1976d2' : 'none',
                        cursor: 'pointer'
                    }}
                >
                    신청 목록
                </button>
                <button
                    onClick={() => setTab('cancel')}
                    style={{
                        fontWeight: tab === 'cancel' ? 'bold' : 'normal',
                        border: 'none',
                        background: 'none',
                        padding: '10px 20px',
                        borderBottom: tab === 'cancel' ? '2px solid #1976d2' : 'none',
                        cursor: 'pointer'
                    }}
                >
                    취소 신청 목록
                </button>
            </div>

            {/* 신청 목록 */}
            {tab === 'apply' && (
                <div>
                    {loading ? (
                        <div>로딩 중...</div>
                    ) : applyError ? (
                        <div style={{ color: 'red' }}>{applyError}</div>
                    ) : applications.length === 0 ? (
                        <div>신청 내역이 없습니다.</div>
                    ) : (
                        applications.map((app) => (
                            <div key={app.fileIndex} className="application-card">
                                <div>제목: {app.title || '-'}</div>
                                <div>위치: {app.latitude}, {app.longitude}</div>
                                <div>상태: {app.approved ? '승인됨' : '대기중'}</div>
                                {!app.approved && (
                                    <button onClick={() => handleApprove(app.fileIndex)}>수락</button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* 취소 신청 목록 */}
            {tab === 'cancel' && (
                <div>
                    {cancelError ? (
                        <div style={{ color: 'red' }}>{cancelError}</div>
                    ) : cancelApplications.length === 0 ? (
                        <div>취소 신청 내역이 없습니다.</div>
                    ) : (
                        cancelApplications.map((app, idx) => (
                            <div key={idx} className="application-card">
                                <div>제목: {app.title || '-'}</div>
                                <div>위치: {app.latitude}, {app.longitude}</div>
                                <button onClick={() => handleCancelApprove(idx)}>취소 승인</button>
                                <button onClick={() => handleCancelReject(idx)}>취소 거절</button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ApplicationManagement; 