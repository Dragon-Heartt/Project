import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const ServerTest = () => {
  const [serverStatus, setServerStatus] = useState('확인 중...');
  const [loading, setLoading] = useState(false);

  const checkServerHealth = async () => {
    setLoading(true);
    try {
      const response = await authAPI.checkHealth();
      setServerStatus(`✅ 서버 연결 성공: ${JSON.stringify(response)}`);
    } catch (error) {
      setServerStatus(`❌ 서버 연결 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServerHealth();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <h4>서버 연결 상태</h4>
      <p>{serverStatus}</p>
      <button 
        onClick={checkServerHealth} 
        disabled={loading}
        style={{ padding: '5px 10px', fontSize: '10px' }}
      >
        {loading ? '확인 중...' : '다시 확인'}
      </button>
    </div>
  );
};

export default ServerTest; 