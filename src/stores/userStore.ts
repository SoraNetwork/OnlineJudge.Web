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
    id: string;
    title: string;
    status: string;
    time: string;
  }[];
}

// 创建全局状态
export const isLoggedIn = ref(false)
export const userInfo = ref<UserInfo | null>(null)

// 登录
export function setLoginState(user: UserInfo) {
  isLoggedIn.value = true
  userInfo.value = user
}

// 登出
export function clearLoginState() {
  isLoggedIn.value = false
  userInfo.value = null
  localStorage.removeItem('jwt_token')
}

// 检查登录状态
export function checkLoginState(): boolean {
  const token = localStorage.getItem('jwt_token')
  // 更新响应式状态
  isLoggedIn.value = !!token
  return isLoggedIn.value
}

checkLoginState() 
