import axios from 'axios';
import Cookies from 'js-cookie';

// 로컬 FastAPI 서버만 사용
const API_BASE_URL = 'http://localhost:8000';

console.log('🚀 API 서버:', API_BASE_URL);

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5초 타임아웃
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log('📤 API 요청:', `${API_BASE_URL}${config.url}`, config.method?.toUpperCase());
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 토큰 추가됨');
    }
    return config;
  },
  (error) => {
    console.error('❌ 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('✅ API 응답 성공:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API 응답 에러:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ 요청 타임아웃');
      throw new Error('서버 응답 시간이 초과되었습니다.');
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 네트워크 에러 - 로컬 서버가 실행되지 않았습니다.');
      throw new Error('로컬 서버(http://localhost:8000)가 실행되지 않았습니다. FastAPI 서버를 먼저 실행해주세요.');
    }
    
    if (error.response?.status === 401) {
      console.log('🔒 인증 만료 - 로그인 페이지로 이동');
      Cookies.remove('access_token');
      window.location.href = '/signin';
    }
    
    return Promise.reject(error);
  }
);

// 인증 관련 API 함수들
export const authAPI = {
  // 회원가입
  signup: async (userData) => {
    try {
      console.log('📝 API 회원가입 요청:', userData.email);
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('❌ API 회원가입 실패:', error);
      
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('네트워크 오류가 발생했습니다.');
    }
  },

  // 로그인
  login: async (userData) => {
    try {
      console.log('🔐 로그인 요청:', userData.email);
      const response = await api.post('/auth/login', userData);
      console.log('✅ 로그인 성공');
      return response.data;
    } catch (error) {
      console.error('❌ API 로그인 실패:', error);
      
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('네트워크 오류가 발생했습니다.');
    }
  },

  // 로그아웃
  logout: () => {
    console.log('👋 로그아웃');
    Cookies.remove('access_token');
    window.location.href = '/signin';
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('❌ 사용자 정보 조회 실패:', error);
      throw error.response?.data || { detail: '사용자 정보를 가져올 수 없습니다.' };
    }
  },

  // 로그인 상태 확인
  isAuthenticated: () => {
    return !!Cookies.get('access_token');
  },

  // 서버 상태 확인
  checkHealth: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('❌ 서버 상태 확인 실패:', error);
      throw error;
    }
  },
};

export default api; 