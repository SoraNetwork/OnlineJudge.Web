<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import { setLoginState } from '@/stores/userStore';
import { loginUser } from "@/api/userApi";
import { message } from "@/services/MessageService";

const router = useRouter();
const route = useRoute();

const loginForm = ref({
  username: "",
  password: "",
});

// 移除错误消息变量，改用全局消息服务
const isLoading = ref(false);

// SHA-256 加密函数
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    // 使用消息服务显示错误
    message.error("请填写用户名和密码");
    return;
  }

  try {
    isLoading.value = true;
    
    // 对密码进行SHA-256哈希
    const passwordHash = await sha256(loginForm.value.password);

    // 调用登录API
    const response = await loginUser({
      userName: loginForm.value.username,
      passwordHash: passwordHash
    });

    if (response.success && response.data) {
      // 保存 JWT Token
      localStorage.setItem("jwt_token", response.data.token);
      
      // 设置用户权限 - 基于用户名来模拟不同权限
      let permissions = [];
      if (loginForm.value.username === 'admin') {
        permissions = ['admin', 'group.admin']; // 管理员权限
      } else if (loginForm.value.username.includes('team')) {
        permissions = ['group.admin']; // 团队管理员权限
      } else {
        permissions = []; // 普通用户权限
      }
      
      // 更新登录状态
      const userProfile = response.data.userProfile;
      setLoginState({
        id: userProfile.id,
        username: userProfile.username,
        nickname: userProfile.nickname,
        permissions: userProfile.permissions,
        rating: userProfile.rating,
        solved: userProfile.solved,
        ranking: userProfile.ranking
      });

      // 使用消息服务显示成功消息
      message.success(`欢迎回来，${userProfile.nickname || userProfile.username}！`);

      // 获取重定向地址或默认返回主页
      const redirect = route.query.redirect as string || "/";
      router.replace(redirect);
    } else {
      // 使用消息服务显示错误
      message.error(response.message || "登录失败");
    }
  } catch (error) {
    // 使用消息服务显示错误
    message.error("登录时发生错误，请稍后重试");
    console.error("登录错误:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 py-8">
    <div class="w-full max-w-md px-4">
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold">登录到 SOJ</h1>
          <p class="text-neutral-600 dark:text-neutral-400 mt-2">欢迎回来！</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- 用户名输入 -->
          <div>
            <label class="block text-sm font-medium mb-2">用户名</label>
            <div class="relative">
              <Icon 
                icon="fluent:person-20-filled" 
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              />
              <fluent-text-input
                v-model="loginForm.username"
                type="text"
                placeholder="请输入用户名"
                appearance="outline"
                class="w-full pl-10"
                :disabled="isLoading"
              >
            </fluent-text-input>
            </div>
          </div>

          <!-- 密码输入 -->
          <div>
            <label class="block text-sm font-medium mb-2">密码</label>
            <div class="relative">
              <Icon 
                icon="fluent:key-20-filled" 
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              />
              <fluent-text-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                appearance="outline"
                class="w-full pl-10"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- 移除静态错误提示区域，改用全局消息服务 -->

          <!-- 登录按钮 -->
          <fluent-button 
            appearance="accent" 
            type="submit"
            class="w-full flex items-center justify-center gap-2 h-10"
            :disabled="isLoading"
          >
            <Icon 
              v-if="isLoading" 
              icon="fluent:spinner-ios-20-regular" 
              class="w-5 h-5 animate-spin"
            />
            {{ isLoading ? '登录中...' : '登录' }}
          </fluent-button>

          <!-- 其他选项 -->
          <div class="flex justify-between text-sm">
            <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">忘记密码？</a>
            <a @click="router.push('/register')" class="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">注册账号</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>