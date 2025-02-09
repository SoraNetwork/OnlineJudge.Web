import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // 替换为你的API基础URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username: string, loginToken: string) => {
  const response = await apiClient.post('/user/login', { username, loginToken });
  return response.data;
};

export const register = async (registerRequest: any) => {
  const response = await apiClient.post('/user/register', registerRequest);
  return response.data;
};

export const getUserProfile = async (username: string) => {
  const response = await apiClient.get(`/user/profile/${username}`);
  return response.data;
};

export const updateUserProfile = async (username: string, updatedProfile: any) => {
  const response = await apiClient.put(`/user/profile/${username}`, updatedProfile);
  return response.data;
};
