<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { setLoginState } from "@/stores/userStore";
import { registerUser } from "@/api/userApi";
import { message } from "@/services/MessageService"; // 导入消息服务
import { Icon } from "@iconify/vue"; // 导入Icon组件

document.title = "Sora Online Judge • 注册";

const router = useRouter();
const isLoading = ref(false); // 添加加载状态

// 表单数据
const formData = ref({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  phone: "",
  nickname: "",
  fullName: "",
  realName: "",
});

// 移除静态错误消息变量，改用消息服务
// const errorMsg = ref("");

// 表单验证规则
const validationRules = {
  username: {
    pattern: /^[a-zA-Z0-9_-]{3,32}$/,
    message: "用户名必须是3-32个字符，只能包含字母、数字、下划线和横线"
  },
  password: {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,32}$/,
    message: "密码必须是6-32个字符，至少包含一个字母和一个数字"
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "请输入有效的邮箱地址"
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: "请输入有效的手机号码"
  },
  nickname: {
    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{2,32}$/,
    message: "昵称必须是2-32个字符，可以包含中文、字母、数字、下划线和横线"
  }
};

// 验证函数
const validateField = (field: keyof typeof validationRules, value: string): string => {
  if (!value) return "";
  
  const rule = validationRules[field];
  if (!rule.pattern.test(value)) {
    return rule.message;
  }
  return "";
};

// 注册处理
const handleRegister = async () => {
  // 验证必填字段
  if (!formData.value.username || !formData.value.password) {
    message.error("用户名和密码不能为空");
    return;
  }

  // 验证用户名
  const usernameError = validateField("username", formData.value.username);
  if (usernameError) {
    message.error(usernameError);
    return;
  }

  // 验证密码
  const passwordError = validateField("password", formData.value.password);
  if (passwordError) {
    message.error(passwordError);
    return;
  }

  // 验证密码确认
  if (formData.value.password !== formData.value.confirmPassword) {
    message.error("两次输入的密码不一致");
    return;
  }

  // 验证可选字段（如果有值）
  if (formData.value.email) {
    const emailError = validateField("email", formData.value.email);
    if (emailError) {
      message.error(emailError);
      return;
    }
  }

  if (formData.value.phone) {
    const phoneError = validateField("phone", formData.value.phone);
    if (phoneError) {
      message.error(phoneError);
      return;
    }
  }

  if (formData.value.nickname) {
    const nicknameError = validateField("nickname", formData.value.nickname);
    if (nicknameError) {
      message.error(nicknameError);
      return;
    }
  }

  try {
    isLoading.value = true; // 开始加载
    const response = await registerUser({
      userName: formData.value.username,
      password: formData.value.password,
      email: formData.value.email || undefined,
      phone: formData.value.phone || undefined,
      nickname: formData.value.nickname || undefined,
      fullName: formData.value.fullName || undefined,
      realName: formData.value.realName || undefined,
    });

    if (response.success && response.data) {
      // 保存token
      localStorage.setItem("jwt_token", response.data.token);
      
      // 更新登录状态
      const userProfile = response.data.userProfile;
      setLoginState({
        id: userProfile.id,
        username: userProfile.username,
        nickname: userProfile.nickname,
        permissions: userProfile.permissions,
        rating: userProfile.rating,
        solved: userProfile.solved,
        ranking: userProfile.ranking,
      });
      
      // 显示注册成功消息
      message.success(`账号注册成功，欢迎 ${userProfile.nickname || userProfile.username}！`);
      router.push("/");
    } else {
      message.error(response.message || "注册失败");
    }
  } catch (error) {
    message.error("注册过程中发生错误");
    console.error(error);
  } finally {
    isLoading.value = false; // 结束加载
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <div class="w-full max-w-md p-8 rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800">
      <h2 class="text-2xl font-bold mb-6 text-center">注册账号</h2>
      
      <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
        <!-- 必填信息 -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">用户名 *</label>
          <fluent-text-input
            v-model="formData.username"
            placeholder="请输入用户名(3-32个字符)"
            appearance="outline"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">密码 *</label>
          <fluent-text-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码(6-32个字符)"
            appearance="outline"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">确认密码 *</label>
          <fluent-text-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            appearance="outline"
          />
        </div>

        <!-- 可选信息 -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">昵称</label>
          <fluent-text-input
            v-model="formData.nickname"
            placeholder="请输入昵称"
            appearance="outline"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">邮箱</label>
          <fluent-text-input
            v-model="formData.email"
            type="email"
            placeholder="请输入邮箱"
            appearance="outline"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">手机号</label>
          <fluent-text-input
            v-model="formData.phone"
            placeholder="请输入手机号"
            appearance="outline"
          />
        </div>

        <!-- 移除静态错误信息显示 -->
        <!-- <p v-if="errorMsg" class="text-red-500 text-sm mt-2">{{ errorMsg }}</p> -->

        <!-- 提交按钮 -->
        <fluent-button
          type="submit"
          appearance="accent"
          class="w-full flex items-center justify-center gap-2 h-10"
          :disabled="isLoading"
        >
          <Icon 
            v-if="isLoading" 
            icon="fluent:spinner-ios-20-regular" 
            class="w-5 h-5 animate-spin"
          />
          {{ isLoading ? '注册中...' : '注册' }}
        </fluent-button>

        <!-- 登录链接 -->
        <p class="text-center text-sm mt-4">
          已有账号？
          <a @click="router.push('/login')" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            立即登录
          </a>
        </p>
      </form>
    </div>
  </div>
</template>