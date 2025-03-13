<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userInfo, setUserDetail } from '@/stores/userStore';
import { updateUserProfile, updateUserPassword } from '@/api/userApi';
import { Icon } from "@iconify/vue";
import { message } from "@/services/MessageService"; // 导入消息服务

const router = useRouter();

document.title = "Sora Online Judge • 个人资料设置";

// 表单数据
const profileForm = ref({
  nickname: userInfo.value?.nickname || '',
  email: userInfo.value?.email || '',
  avatar: userInfo.value?.avatar || ''
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 提交状态
const isSubmitting = ref(false);
const isChangingPassword = ref(false);

// 错误信息
const error = ref('');
const success = ref('');

// 表单提交处理
const handleProfileSubmit = async () => {
  try {
    if (isSubmitting.value) return;
    
    isSubmitting.value = true;
    success.value = '';
    error.value = '';
    
    const response = await updateUserProfile({
      nickname: profileForm.value.nickname,
      email: profileForm.value.email,
      avatar: profileForm.value.avatar
    });
    
    if (response.success) {
      message.success('个人资料更新成功！');
      success.value = '个人资料更新成功！';
      
      // 更新本地存储的用户信息
      if (userInfo.value) {
        userInfo.value = {
          ...userInfo.value,
          nickname: profileForm.value.nickname,
          email: profileForm.value.email,
          avatar: profileForm.value.avatar
        };
      }
    } else {
      error.value = response.message || '更新失败，请稍后重试';
      message.error(response.message || '更新失败，请稍后重试');
    }
  } catch (err: any) {
    error.value = err.message || '更新失败，请稍后重试';
    message.error(err.message || '更新失败，请稍后重试');
  } finally {
    isSubmitting.value = false;
  }
};

const handlePasswordSubmit = async () => {
  try {
    if (isChangingPassword.value) return;
    
    isChangingPassword.value = true;
    success.value = '';
    error.value = '';
    
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      error.value = '两次输入的密码不一致';
      message.error('两次输入的密码不一致');
      isChangingPassword.value = false;
      return;
    }
    
    if (passwordForm.value.newPassword.length < 6) {
      error.value = '新密码长度必须大于或等于6个字符';
      message.error('新密码长度必须大于或等于6个字符');
      isChangingPassword.value = false;
      return;
    }
    
    const response = await updateUserPassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    
    if (response.success) {
      success.value = '密码修改成功！';
      message.success('密码修改成功！');
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    } else {
      error.value = response.message || '密码修改失败，请稍后重试';
      message.error(response.message || '密码修改失败，请稍后重试');
    }
  } catch (err: any) {
    error.value = err.message || '密码修改失败，请稍后重试';
    message.error(err.message || '密码修改失败，请稍后重试');
  } finally {
    isChangingPassword.value = false;
  }
};

// 添加输入框状态控制
const inputs = ref({
  nickname: { appearance: 'outline' as const },
  email: { appearance: 'outline' as const },
  bio: { appearance: 'outline' as const },
  avatar: { appearance: 'outline' as const },
  currentPassword: { appearance: 'outline' as const },
  newPassword: { appearance: 'outline' as const },
  confirmPassword: { appearance: 'outline' as const }
});
</script>

<template>
  <div class="flex justify-center min-h-screen bg-neutral-100 dark:bg-neutral-900">
    <div class="w-full max-w-6xl p-8">
      <div class="flex items-center gap-4 mb-8">
        <Icon icon="fluent:settings-20-filled" class="w-8 h-8" />
        <h1 class="text-2xl font-bold">个人资料设置</h1>
      </div>
      
      <!-- 错误/成功提示 -->
      <div v-if="error" class="mb-6 bg-red-100 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
        <Icon icon="fluent:error-circle-20-filled" class="w-5 h-5 text-red-600 dark:text-red-400" />
        <span class="text-red-700 dark:text-red-300">{{ error }}</span>
      </div>
      <div v-if="success" class="mb-6 bg-green-100 border border-green-200 dark:bg-green-900/20 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
        <Icon icon="fluent:checkmark-circle-20-filled" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-green-700 dark:text-green-300">{{ success }}</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 基本信息设置 -->
        <div class="flex-1">
          <div class="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
            <div class="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div class="flex items-center gap-3">
                <Icon icon="fluent:person-20-filled" class="w-6 h-6" />
                <h2 class="text-xl font-bold">基本信息</h2>
              </div>
            </div>
            
            <form @submit.prevent="handleProfileSubmit" class="p-6 flex flex-col gap-6">
              <div class="flex flex-col gap-2">
                <label class="font-medium flex items-center gap-2">
                  <Icon icon="fluent:person-20-regular" class="w-5 h-5" />
                  用户名
                </label>
                <fluent-text-input
                  type="text"
                  :value="userInfo?.username"
                  disabled
                  appearance="filled-darker"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-medium flex items-center gap-2">
                  <Icon icon="fluent:tag-20-regular" class="w-5 h-5" />
                  昵称
                </label>
                <fluent-text-input
                  type="text"
                  v-model="profileForm.nickname"
                  v-bind="inputs.nickname"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-medium flex items-center gap-2">
                  <Icon icon="fluent:mail-20-regular" class="w-5 h-5" />
                  邮箱
                </label>
                <fluent-text-input
                  type="email"
                  v-model="profileForm.email"
                  v-bind="inputs.email"
                />
              </div>

            <!--  <div class="flex flex-col gap-2">
                <label class="font-medium flex items-center gap-2">
                  <Icon icon="fluent:text-description-20-regular" class="w-5 h-5" />
                  个人简介
                </label>
                <fluent-textarea
                class="max-w-full"
                  v-model="profileForm.bio"
                  :rows="4"
                  v-bind="inputs.bio"
                  resize="vertical"
                  placeholder="写点什么来介绍自己..."
                />
              </div>-->

              <div class="flex flex-col gap-2">
                <label class="font-medium flex items-center gap-2">
                  <Icon icon="fluent:image-20-regular" class="w-5 h-5" />
                  头像URL
                </label>
                <fluent-text-input
                  type="url"
                  v-model="profileForm.avatar"
                  v-bind="inputs.avatar"
                  placeholder="https://example.com/avatar.png"
                />
              </div>

              <fluent-button appearance="accent" type="submit" class="self-end" :disabled="isSubmitting">
                <Icon v-if="isSubmitting" icon="fluent:spinner-ios-20-regular" class="w-5 h-5 mr-2 animate-spin" />
                <Icon v-else icon="fluent:save-20-filled" class="w-5 h-5 mr-2" />
                {{ isSubmitting ? '保存中...' : '保存修改' }}
              </fluent-button>
            </form>
          </div>
        </div>

        <!-- 密码修改 -->
        <div class="lg:w-[400px]">
          <div class="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
            <div class="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div class="flex items-center gap-3">
                <Icon icon="fluent:key-20-filled" class="w-6 h-6" />
                <h2 class="text-xl font-bold">修改密码</h2>
              </div>
            </div>
            
            <form @submit.prevent="handlePasswordSubmit" class="p-6 flex flex-col gap-6">
              <div class="flex flex-col gap-2">
                <label class="font-medium flex items-center gap-2">
                  <Icon icon="fluent:lock-closed-20-regular" class="w-5 h-5" />
                  当前密码
                </label>
                <fluent-text-input
                  type="password"
                  v-model="passwordForm.currentPassword"
                  v-bind="inputs.currentPassword"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-medium flex items-center gap-2">
                  <Icon icon="fluent:lock-20-regular" class="w-5 h-5" />
                  新密码
                </label>
                <fluent-text-input
                  type="password"
                  v-model="passwordForm.newPassword"
                  v-bind="inputs.newPassword"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-medium flex items-center gap-2">
                  <Icon icon="fluent:lock-closed-20-regular" class="w-5 h-5" />
                  确认新密码
                </label>
                <fluent-text-input
                  type="password"
                  v-model="passwordForm.confirmPassword"
                  v-bind="inputs.confirmPassword"
                />
              </div>

              <fluent-button appearance="accent" type="submit" class="self-end" :disabled="isChangingPassword">
                <Icon v-if="isChangingPassword" icon="fluent:spinner-ios-20-regular" class="w-5 h-5 mr-2 animate-spin" />
                <Icon v-else icon="fluent:key-20-filled" class="w-5 h-5 mr-2" />
                {{ isChangingPassword ? '修改中...' : '修改密码' }}
              </fluent-button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
