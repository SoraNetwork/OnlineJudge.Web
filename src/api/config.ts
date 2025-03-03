/**
 * API配置文件
 */

// API服务器基础URL
export const API_BASE_URL = 'http://127.0.0.1:5148';

// API路径前缀
export const API_PREFIX = '/api';

// 完整API基础URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${API_PREFIX}${endpoint}`;
};

// 默认请求选项
export const DEFAULT_REQUEST_OPTIONS = {
  headers: {
    'Content-Type': 'application/json'
  }
};

// 携带token的请求头
export const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    ...DEFAULT_REQUEST_OPTIONS.headers,
    'Authorization': token ? `Bearer ${token}` : ''
  };
};
