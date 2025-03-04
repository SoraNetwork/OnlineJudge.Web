<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

document.title = "Sora Online Judge • 系统设置";

// 系统设置数据
const settings = ref({
  // 站点设置
  siteName: 'Sora Online Judge',
  siteDescription: '高效、专业的在线评测系统',
  siteLogo: '/Noir.png',
  
  // 注册设置
  allowRegistration: true,
  requireEmailVerification: true,
  defaultUserRole: '用户',
  
  // 评测设置
  maxSubmissionPerDay: 100,
  maxCompileTime: 10,
  maxRunTime: 1000,
  maxMemory: 256,
  
  // 缓存设置
  enableCache: true,
  cacheExpiration: 60,
  
  // 安全设置
  enableCaptcha: true,
  loginAttempts: 5,
  lockoutDuration: 30,
  
  // 邮件设置
  smtpServer: 'smtp.example.com',
  smtpPort: 587,
  smtpUsername: 'noreply@example.com',
  smtpPassword: '',
  smtpFromEmail: 'noreply@example.com',
  smtpFromName: 'Sora OJ',
  
  // 外观设置
  defaultTheme: 'auto',
  allowUserTheme: true
});

const isSaving = ref(false);
const saveSuccess = ref(false);

// 保存设置
const saveSettings = async () => {
  try {
    isSaving.value = true;
    
    // 这里添加保存设置的API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error('保存设置失败', error);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col px-6 py-8 max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">系统设置</h1>
      <p class="text-neutral-600 dark:text-neutral-400">配置系统参数、安全性和服务选项</p>
    </div>
    
    <div class="flex justify-end mb-4">
      <fluent-button appearance="accent" @click="saveSettings" :disabled="isSaving">
        <Icon v-if="isSaving" icon="fluent:spinner-ios-20-regular" class="w-5 h-5 mr-2 animate-spin" />
        <Icon v-else icon="fluent:save-20-filled" class="w-5 h-5 mr-2" />
        {{ isSaving ? '保存中...' : '保存设置' }}
      </fluent-button>
      <div v-if="saveSuccess" class="ml-4 text-green-600 dark:text-green-400 flex items-center">
        <Icon icon="fluent:checkmark-circle-20-filled" class="w-5 h-5 mr-1" />
        设置已保存
      </div>
    </div>

    <fluent-tabs>
      <fluent-tab id="site-tab" selected>站点设置</fluent-tab>
      <fluent-tab id="registration-tab">注册设置</fluent-tab>
      <fluent-tab id="judge-tab">评测设置</fluent-tab>
      <fluent-tab id="security-tab">安全设置</fluent-tab>
      <fluent-tab id="mail-tab">邮件设置</fluent-tab>
      <fluent-tab id="appearance-tab">外观设置</fluent-tab>
      
      <fluent-tab-panel id="site-panel">
        <fluent-card class="p-6 mt-4">
          <h2 class="text-xl font-semibold mb-4">站点设置</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label for="site-name" class="font-medium">站点名称</label>
              <fluent-text-field id="site-name" v-model="settings.siteName" appearance="outline" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="site-description" class="font-medium">站点描述</label>
              <fluent-text-field id="site-description" v-model="settings.siteDescription" appearance="outline" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="site-logo" class="font-medium">站点Logo</label>
              <div class="flex items-center gap-2">
                <img :src="settings.siteLogo" alt="Site Logo" class="h-10 w-auto border-1 border-neutral-200 dark:border-neutral-700 rounded-sm" />
                <fluent-button appearance="outline">
                  <Icon icon="fluent:image-20-regular" class="w-5 h-5 mr-2" />
                  更换Logo
                </fluent-button>
              </div>
            </div>
          </div>
        </fluent-card>
      </fluent-tab-panel>
      
      <fluent-tab-panel id="registration-panel">
        <fluent-card class="p-6 mt-4">
          <h2 class="text-xl font-semibold mb-4">注册设置</h2>
          <div class="flex flex-col gap-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">允许用户注册</h3>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">开启后，新用户可以自行注册账号</p>
              </div>
              <fluent-switch :checked="settings.allowRegistration" @change="settings.allowRegistration = !settings.allowRegistration" />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">要求邮箱验证</h3>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">开启后，新注册用户需要验证邮箱才能使用账号</p>
              </div>
              <fluent-switch :checked="settings.requireEmailVerification" @change="settings.requireEmailVerification = !settings.requireEmailVerification" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="default-role" class="font-medium">默认用户角色</label>
              <fluent-select id="default-role" v-model="settings.defaultUserRole">
                <fluent-option value="用户">用户</fluent-option>
                <fluent-option value="团队管理员">团队管理员</fluent-option>
              </fluent-select>
            </div>
          </div>
        </fluent-card>
      </fluent-tab-panel>
      
      <fluent-tab-panel id="judge-panel">
        <fluent-card class="p-6 mt-4">
          <h2 class="text-xl font-semibold mb-4">评测设置</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label for="max-submissions" class="font-medium">每日最大提交次数</label>
              <fluent-number-field id="max-submissions" v-model="settings.maxSubmissionPerDay" appearance="outline" />
              <p class="text-sm text-neutral-600 dark:text-neutral-400">0表示不限制</p>
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="max-compile-time" class="font-medium">最大编译时间(秒)</label>
              <fluent-number-field id="max-compile-time" v-model="settings.maxCompileTime" appearance="outline" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="max-run-time" class="font-medium">最大运行时间(ms)</label>
              <fluent-number-field id="max-run-time" v-model="settings.maxRunTime" appearance="outline" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="max-memory" class="font-medium">最大内存使用(MB)</label>
              <fluent-number-field id="max-memory" v-model="settings.maxMemory" appearance="outline" />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">启用缓存</h3>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">开启后，将缓存评测结果以提高性能</p>
              </div>
              <fluent-switch :checked="settings.enableCache" @change="settings.enableCache = !settings.enableCache" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="cache-expiration" class="font-medium">缓存过期时间(分钟)</label>
              <fluent-number-field id="cache-expiration" v-model="settings.cacheExpiration" appearance="outline" :disabled="!settings.enableCache" />
            </div>
          </div>
        </fluent-card>
      </fluent-tab-panel>
      
      <fluent-tab-panel id="security-panel">
        <fluent-card class="p-6 mt-4">
          <h2 class="text-xl font-semibold mb-4">安全设置</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">启用验证码</h3>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">开启后，登录和注册需要进行验证码验证</p>
              </div>
              <fluent-switch :checked="settings.enableCaptcha" @change="settings.enableCaptcha = !settings.enableCaptcha" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="login-attempts" class="font-medium">登录尝试次数</label>
              <fluent-number-field id="login-attempts" v-model="settings.loginAttempts" appearance="outline" />
              <p class="text-sm text-neutral-600 dark:text-neutral-400">超过此次数后账号将被锁定</p>
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="lockout-duration" class="font-medium">锁定时长(分钟)</label>
              <fluent-number-field id="lockout-duration" v-model="settings.lockoutDuration" appearance="outline" />
            </div>
          </div>
        </fluent-card>
      </fluent-tab-panel>
      
      <fluent-tab-panel id="mail-panel">
        <fluent-card class="p-6 mt-4">
          <h2 class="text-xl font-semibold mb-4">邮件设置</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label for="smtp-server" class="font-medium">SMTP服务器</label>
              <fluent-text-field id="smtp-server" v-model="settings.smtpServer" appearance="outline" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="smtp-port" class="font-medium">SMTP端口</label>
              <fluent-number-field id="smtp-port" v-model="settings.smtpPort" appearance="outline" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="smtp-username" class="font-medium">SMTP用户名</label>
              <fluent-text-field id="smtp-username" v-model="settings.smtpUsername" appearance="outline" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="smtp-password" class="font-medium">SMTP密码</label>
              <fluent-text-field id="smtp-password" v-model="settings.smtpPassword" appearance="outline" type="password" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="smtp-from-email" class="font-medium">发信邮箱</label>
              <fluent-text-field id="smtp-from-email" v-model="settings.smtpFromEmail" appearance="outline" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="smtp-from-name" class="font-medium">发信人名称</label>
              <fluent-text-field id="smtp-from-name" v-model="settings.smtpFromName" appearance="outline" />
            </div>
            
            <div class="md:col-span-2 flex justify-end">
              <fluent-button appearance="outline">
                <Icon icon="fluent:mail-20-regular" class="w-5 h-5 mr-2" />
                发送测试邮件
              </fluent-button>
            </div>
          </div>
        </fluent-card>
      </fluent-tab-panel>
      
      <fluent-tab-panel id="appearance-panel">
        <fluent-card class="p-6 mt-4">
          <h2 class="text-xl font-semibold mb-4">外观设置</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label for="default-theme" class="font-medium">默认主题</label>
              <fluent-select id="default-theme" v-model="settings.defaultTheme">
                <fluent-option value="auto">跟随系统</fluent-option>
                <fluent-option value="light">亮色</fluent-option>
                <fluent-option value="dark">暗色</fluent-option>
              </fluent-select>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">允许用户更改主题</h3>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">开启后，用户可以自定义界面主题</p>
              </div>
              <fluent-switch :checked="settings.allowUserTheme" @change="settings.allowUserTheme = !settings.allowUserTheme" />
            </div>
          </div>
        </fluent-card>
      </fluent-tab-panel>
    </fluent-tabs>
  </div>
</template>
