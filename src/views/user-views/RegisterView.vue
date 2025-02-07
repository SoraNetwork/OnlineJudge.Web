<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { setLoginState } from "@/stores/userStore";

document.title = "Sora Online Judge • 注册";

const router = useRouter();

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

// 错误信息
const errorMsg = ref("");

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
  // 重置错误信息
  errorMsg.value = "";

  // 验证必填字段
  if (!formData.value.username || !formData.value.password) {
    errorMsg.value = "用户名和密码不能为空";
    return;
  }

  // 验证用户名
  const usernameError = validateField("username", formData.value.username);
  if (usernameError) {
    errorMsg.value = usernameError;
    return;
  }

  // 验证密码
  const passwordError = validateField("password", formData.value.password);
  if (passwordError) {
    errorMsg.value = passwordError;
    return;
  }

  // 验证密码确认
  if (formData.value.password !== formData.value.confirmPassword) {
    errorMsg.value = "两次输入的密码不一致";
    return;
  }

  // 验证可选字段（如果有值）
  if (formData.value.email) {
    const emailError = validateField("email", formData.value.email);
    if (emailError) {
      errorMsg.value = emailError;
      return;
    }
  }

  if (formData.value.phone) {
    const phoneError = validateField("phone", formData.value.phone);
    if (phoneError) {
      errorMsg.value = phoneError;
      return;
    }
  }

  if (formData.value.nickname) {
    const nicknameError = validateField("nickname", formData.value.nickname);
    if (nicknameError) {
      errorMsg.value = nicknameError;
      return;
    }
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.value.username,
        password: formData.value.password,
        email: formData.value.email || undefined,
        phone: formData.value.phone || undefined,
        nickname: formData.value.nickname || undefined,
        fullName: formData.value.fullName || undefined,
        realName: formData.value.realName || undefined,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // 保存token
      localStorage.setItem("jwt_token", data.data.token);
      // 更新登录状态
      setLoginState({
        id: 0, // 后端未返回id,暂时使用0
        username: data.data.username,
        nickname: data.data.nickname,
        permissions: ["user", "public"],
        rating: 0,
        solved: 0,
        ranking: 0,
      });
      router.push("/");
    } else {
      errorMsg.value = data.message || "注册失败";
    }
  } catch (error) {
    errorMsg.value = "注册过程中发生错误";
    console.error(error);
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

        <!-- 错误信息显示 -->
        <p v-if="errorMsg" class="text-red-500 text-sm mt-2">{{ errorMsg }}</p>

        <!-- 提交按钮 -->
        <fluent-button
          type="submit"
          appearance="accent"
          class="w-full flex items-center justify-center gap-2 h-10"
        >
          注册
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