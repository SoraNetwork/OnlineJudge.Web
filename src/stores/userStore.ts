import type { Submission } from '@/components/RecentSubmissions.vue';
import { ref } from 'vue'

export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  permissions: string[];
  rating: number;
  solved: number;
  ranking: number;
  avatar?: string;
  recentSubmissions?: {
    questionId: string;  // 改为小写的 questionId
    id: string;
    status: string;
    time: string;
    memory: string;
    language: string;
    submitTime: string;
  }[];
}

// 创建全局状态
export const isLoggedIn = ref(false)
export const userInfo = ref<UserInfo | null>(null)

// 登录
export function setLoginState(user: UserInfo) {
  isLoggedIn.value = true
  userInfo.value = {
    ...user,
    recentSubmissions: user.recentSubmissions || [] 
  }
  // 保存到本地存储
  localStorage.setItem('user_info', JSON.stringify(userInfo.value))
}

// 登出
export function clearLoginState() {
  isLoggedIn.value = false
  userInfo.value = null
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('user_info') 
}

// 检查登录状态
export function checkLoginState(): boolean {
  const token = localStorage.getItem('jwt_token')
  const savedUserInfo = localStorage.getItem('user_info')
  
  if (token && savedUserInfo) {
    try {
      const parsedUserInfo = JSON.parse(savedUserInfo)
      isLoggedIn.value = true
      userInfo.value = parsedUserInfo
    } catch (e) {
      clearLoginState()
      return false
    }
  } else {
    clearLoginState()
    return false
  }
  
  return isLoggedIn.value
}

// 初始化时检查登录状态
checkLoginState()
