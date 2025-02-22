<script setup lang="ts">
import AnnounceBar from "@/components/AnnounceBar.vue";
import TokenItem from "@/components/TokenItem.vue";
import RecommendedProblems from "@/components/RecommendedProblems.vue";
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useRouter, type RouteLocationAsPathGeneric, type RouteLocationAsRelativeGeneric } from "vue-router";
import { isLoggedIn, userInfo, clearLoginState } from '@/stores/userStore.ts';
import { login, register, getUserProfile, updateUserProfile } from '@/api/userApi.ts';

document.title = "Sora Online Judge • 主页";

// 模拟数据，实际使用时应该从API获取
const recentContests = [
  { id: 1, title: "每周算法练习赛 #1", startTime: "2024-02-01 14:00", status: "即将开始" },
  { id: 2, title: "新手入门赛", startTime: "2024-01-28 19:00", status: "进行中" },
  { id: 3, title: "寒假集训营", startTime: "2024-01-25 09:00", status: "已结束" },
];

const recommendedProblems = [
  { id: "P1001", title: "A + B Problem", difficulty: "入门", acceptance: "95%" },
  { id: "P1002", title: "过河卒", difficulty: "简单", acceptance: "45%" },
  { id: "P1003", title: "铺地毯", difficulty: "中等", acceptance: "35%" },
  { id: "P1004", title: "方格取数", difficulty: "困难", acceptance: "25%" },
];

const topUsers = [
  { avatar:"", rank: 1, username: "tourist", rating: 3000, solved: 1500 },
  { avatar:"", rank: 2, username: "Petr", rating: 2800, solved: 1200 },
  { avatar:"", rank: 3, username: "jiangly", rating: 2750, solved: 1100 },
];

const router = useRouter();

const handleLogin = () => {
  // 处理登录逻辑
  console.log("跳转到登录页面");
  navigate('/login');
};


const handleRegister = () => {
  // 处理注册逻辑
  console.log("跳转到注册页面");
  navigate('/register');
};

// 添加登出处理函数
const handleLogout = () => {
  clearLoginState();
  navigate('/');
};

const navigate = (path: string)=>{
  window.scrollTo(0, 0);
  router.push(path)
}

// 获取用户名首字母的函数
const getInitials = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};
</script>

<template>
  <div class="flex flex-col">
    <AnnounceBar>
      建设中...
    </AnnounceBar>

    <div class="flex flex-col md:flex-row gap-6 p-8">
      <!-- 左侧面板：个人信息和排行榜 -->
      <div class="flex flex-col gap-6 md:w-1/3">
        <!-- 个人信息/登录卡片 -->
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <div v-if="isLoggedIn" class="flex flex-col gap-4">
            <!-- 已登录状态 -->
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-4">
                <!-- 添加头像/徽章 -->
                <div v-if="userInfo?.avatar" class="w-12 h-12">
                  <fluent-avatar
                    :image="userInfo.avatar"
                    :title="userInfo.nickname || userInfo.username"
                  >
                    <span slot="badge">{{ userInfo.nickname || userInfo.username }}</span>
                  </fluent-avatar>
                </div>
                <div v-else class="w-12 h-12">
                  <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-xl font-medium">
                    {{ getInitials(userInfo?.nickname || userInfo?.username || '') }}
                    <span class="ml-1 text-sm">{{ userInfo?.nickname || userInfo?.username }}</span>
                  </fluent-badge>
                </div>
                <div class="flex flex-col gap-2">
                  <h2 class="text-2xl font-bold">{{ userInfo?.nickname || userInfo?.username }}</h2>
                  <div class="flex gap-4 text-neutral-600 dark:text-neutral-400">
                    <span>Rating: {{ userInfo?.rating }}</span>
                    <span>已解决: {{ userInfo?.solved }}</span>
                  </div>
                  <div class="text-neutral-600 dark:text-neutral-400">
                    <span>排名: #{{ userInfo?.ranking }}</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <TokenItem
                  class="cursor-pointer" 
                  Token="查看资料" 
                  Glyph="fluent:person-20-filled" 
                  @click="router.push(`/profile/${userInfo?.username}`)" 
                />
                <TokenItem 
                  class="cursor-pointer"
                  Token="登出" 
                  Glyph="fluent:sign-out-20-filled" 
                  @click="handleLogout"
                />
              </div>
            </div>
            
            <!-- 最近提交 -->
            <div class="mt-2">
              <h3 class="text-lg font-semibold mb-3">最近提交</h3>
              <div class="flex flex-col gap-2">
                <div v-for="submission in userInfo?.recentSubmissions" :key="submission.id"
                  class="flex justify-between items-center py-2 border-b-1 border-neutral-200 dark:border-neutral-700 last:border-0">
                  <div class="flex items-center gap-3">
                    <span class="text-neutral-600 dark:text-neutral-400">{{ submission.id }}</span>
                    <span class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{{ submission.title }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <TokenItem 
                      :Token="submission.status"
                      :Glyph="submission.status === '通过' ? 'fluent:checkmark-circle-20-filled' : 'fluent:dismiss-circle-20-filled'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 未登录状态 -->
          <div v-else class="flex flex-col items-center gap-6 py-4">
            <div class="flex flex-col items-center gap-2">
              <h2 class="text-2xl font-bold">欢迎来到 SOJ</h2>
              <p class="text-neutral-600 dark:text-neutral-400">登录以开始你的编程之旅</p>
            </div>
            <div class="flex gap-4">
              <fluent-button appearance="accent" @click="handleLogin">
                <Icon icon="fluent:person-20-filled" class="w-5 h-5 mr-2" />
                登录
              </fluent-button>
              <fluent-button appearance="outline" @click="handleRegister">
                <Icon icon="fluent:person-add-20-regular" class="w-5 h-5 mr-2" />
                注册
              </fluent-button>
            </div>
          </div>
        </div>

        <!-- 排行榜 -->
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">排行榜</h2>
            <a class="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline text-sm">查看全部</a>
          </div>
          <div class="flex flex-col">
            <div v-for="user in topUsers" :key="user.rank"
              class="flex items-center justify-between py-3 border-b-1 border-neutral-200 dark:border-neutral-700 last:border-0">
              <div class="flex items-center gap-3">
                <span class="font-bold w-6">{{ user.rank }}</span>
                <!-- 添加头像/徽章 -->
                <div class="w-8 h-8 flex items-center">
                  <div v-if="user.avatar" class="w-full h-full">
                    <fluent-avatar
                      :image="user.avatar"
                      :title="user.username"
                    >
                      <span slot="badge">{{ user.username }}</span>
                    </fluent-avatar>
                  </div>
                  <div v-else class="w-full h-full">
                    <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-sm font-medium">
                      {{ getInitials(user.username) }}
                      <span class="ml-1 text-xs">{{ user.username }}</span>
                    </fluent-badge>
                  </div>
                </div>
                <span class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{{ user.username }}</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-sm text-neutral-600 dark:text-neutral-400">Rating: {{ user.rating }}</span>
                <span class="text-sm text-neutral-600 dark:text-neutral-400">已解决: {{ user.solved }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板：题目列表和比赛 -->
      <div class="md:w-2/3 flex flex-col gap-6">
        <!-- 题目列表 -->
        <RecommendedProblems :link_flag="true" title="推荐题目"/>
        <!-- 最近比赛 -->
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">最近比赛</h2>
            <a @click="navigate('/contests')" class="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline text-sm">查看全部</a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="contest in recentContests" :key="contest.id"
            @click="navigate(`contests/${contest.id}`)"
            class="bg-neutral-50 dark:bg-neutral-800 rounded-lg border-1 border-neutral-200 dark:border-neutral-700 p-6 hover:border-blue-500 transition-colors cursor-pointer group">
              <div class="flex justify-between items-start">
                <h3 class="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ contest.title }}</h3>
                <TokenItem :Token="contest.status" 
                  :Glyph="contest.status === '即将开始' ? 'fluent:calendar-clock-20-filled' : 
                         contest.status === '进行中' ? 'fluent:play-circle-20-filled' : 'fluent:checkmark-circle-20-filled'"
                />
              </div>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{{ contest.startTime }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
