import axios from 'axios';
import { getApiUrl, DEFAULT_REQUEST_OPTIONS, getAuthHeaders } from './config';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // 替换为你的API基础URL
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 用户注册请求接口
 */
export interface UserRegisterRequest {
  userName: string;
  password: string;
  email?: string;
  phone?: string;
  nickname?: string;
  realName?: string;
  fullName?: string;
}

/**
 * 用户登录请求接口
 */
export interface UserLoginRequest {
  userName: string;
  passwordHash: string;
}

/**
 * 用户信息接口
 */
export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  email?: string;
  permissions: string[];
  rating: number;
  solved: number;
  ranking: number;
}

/**
 * 用户详细资料接口
 */
export interface UserProfileDetail {
  id: string;
  username: string;
  nickname: string;
  email?: string;
  joinDate: string;
  rating: number;
  ranking: number;
  stats: {
    solved: number;
    attempted: number;
    submissions: number;
    acceptanceRate: string;
  };
  badges?: {
    name: string;
    icon: string;
    description: string;
  }[];
  recentActivity?: {
    type: string;
    problem?: string;
    contest?: string;
    title?: string;
    result: string;
    time: string;
  }[];
  problemTags?: {
    name: string;
    count: number;
  }[];
  ratingHistory?: {
    date: string;
    rating: number;
  }[];
}

/**
 * 个人资料更新请求
 */
export interface UserProfileUpdateRequest {
  nickname?: string;
  email?: string;
  avatar?: string;
  realName?: string;
  fullName?: string;
  bio?: string;
}

/**
 * 密码更新请求
 */
export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * 登录响应接口
 */
export interface AuthResponse {
  token: string;
  userProfile: UserProfile;
}

/**
 * 用户注册
 * @param userData 用户注册数据
 * @returns 注册结果
 */
export const registerUser = async (userData: UserRegisterRequest): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(getApiUrl('/authenticate/register'), {
      method: 'POST',
      headers: DEFAULT_REQUEST_OPTIONS.headers,
      body: JSON.stringify(userData)
    });

    return await response.json();
  } catch (error) {
    console.error('注册请求失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 用户登录
 * @param loginData 用户登录数据
 * @returns 登录结果
 */
export const loginUser = async (loginData: UserLoginRequest): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(getApiUrl('/authenticate/login'), {
      method: 'POST',
      headers: DEFAULT_REQUEST_OPTIONS.headers,
      body: JSON.stringify(loginData)
    });

    return await response.json();
  } catch (error) {
    console.error('登录请求失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 获取用户资料
 * @param userId 用户ID或用户名
 * @returns 用户资料
 */
export const getUserProfile = async (userId: string): Promise<ApiResponse<UserProfileDetail>> => {
  try {
    const response = await fetch(getApiUrl(`/user/profile/${userId}`), {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await response.json();
  } catch (error) {
    console.error('获取用户资料失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 更新用户资料
 * @param profileData 用户资料数据
 * @returns 更新结果
 */
export const updateUserProfile = async (profileData: UserProfileUpdateRequest): Promise<ApiResponse<string>> => {
  try {
    const response = await fetch(getApiUrl('/user/profile'), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        nickname: profileData.nickname,
        avatarUrl: profileData.avatar,
        email: profileData.email,
        realName: profileData.realName,
        fullName: profileData.fullName
      })
    });

    return await response.json();
  } catch (error) {
    console.error('更新用户资料失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 更新用户密码
 * @param passwordData 密码数据
 * @returns 更新结果
 */
export const updateUserPassword = async (passwordData: PasswordUpdateRequest): Promise<ApiResponse<string>> => {
  try {
    const response = await fetch(getApiUrl('/user/password'), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });

    return await response.json();
  } catch (error) {
    console.error('更新密码失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};
