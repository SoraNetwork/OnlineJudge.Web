<script setup lang="ts">
import AnnounceBar from "@/components/AnnounceBar.vue";
import TokenItem from "@/components/TokenItem.vue";
import RecommendedProblems from "@/components/RecommendedProblems.vue";
import { Icon } from "@iconify/vue";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { isLoggedIn, userInfo, clearLoginState, setUserDetail } from '@/stores/userStore.ts';
import { getUserProfile, updateUserProfile } from '@/api/userApi.ts';
import RecentSubmissions from "@/components/RecentSubmissions.vue";
import { getContests } from '@/api/contestApi';
import { getQuestions } from '@/api/questionApi';

document.title = "Sora Online Judge • 主页";

// 使用响应式数据代替静态数据
const recentContests = ref<any[]>([]);
const recommendedProblems = ref<any[]>([]);
const topUsers = ref([
  { avatar: "", rank: 1, username: "tourist", rating: 3000, solved: 1500 },
  { avatar: "", rank: 2, username: "Petr", rating: 2800, solved: 1200 },
  { avatar: "", rank: 3, username: "jiangly", rating: 2750, solved: 1100 },
]);

const router = useRouter();
const loading = ref({
  contests: false,
  problems: false,
  userDetail: false
});
const error = ref({
  contests: '',
  problems: '',
  userDetail: ''
});

// 添加获取用户详细信息的方法
const loadUserDetail = async () => {
  if (!isLoggedIn.value || !userInfo.value?.username) return;
  
  loading.value.userDetail = true;
  try {
    const response: { success: boolean; data?: any; message?: string } = await getUserProfile(userInfo.value.username);
    if (response.success && response.data) {
      // 将详细信息更新到userStore中
      setUserDetail(response.data);
    } else {
      error.value.userDetail = response.message || "获取用户详情失败";
    }
  } catch (err) {
    error.value.userDetail = "获取用户详情时出错";
    console.error('获取用户详情失败:', err);
  } finally {
    loading.value.userDetail = false;
  }
};

// 加载最近比赛数据
const loadRecentContests = async () => {
  loading.value.contests = true;
  try {
    const response = await getContests({ pageSize: 3, sortBy: 'startTime' });
    if (response.success && response.data) {
      recentContests.value = response.data;
    } else {
      error.value.contests = response.message || "获取比赛列表失败";
    }
  } catch (err) {
    error.value.contests = "获取比赛数据时出错";
    console.error('获取比赛列表失败:', err);
  } finally {
    loading.value.contests = false;
  }
};

// 加载推荐题目数据
const loadRecommendedProblems = async () => {
  loading.value.problems = true;
  try {
    const response = await getQuestions({ pageSize: 4 });
    if (response.success && response.data) {
      recommendedProblems.value = response.data.items.map(item => ({
        id: item.id,
        title: item.title,
        difficulty: item.difficulty,
        // 计算通过率，使用acceptCount和submitCount
        acceptance: item.submitCount && item.submitCount > 0
          ? `${Math.round((item.acceptCount || 0) / item.submitCount * 100)}%`
          : "未知"
      }));
    } else {
      error.value.problems = response.message || "获取题目列表失败";
    }
  } catch (err) {
    error.value.problems = "获取题目数据时出错";
    console.error('获取题目列表失败:', err);
  } finally {
    loading.value.problems = false;
  }
};

// 在组件挂载时加载数据
onMounted(() => {
  loadRecentContests();
  loadRecommendedProblems();
  if (isLoggedIn.value) {
    loadUserDetail();
  }
});

// 监听登录状态变化，当用户登录时加载详细信息
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    loadUserDetail();
  }
});

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

const navigate = (path: string) => {
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
        <div
          class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <div v-if="isLoggedIn" class="flex flex-col gap-4">
            <!-- 已登录状态 -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-4">
                <!-- 添加头像/徽章 -->
                <div v-if="userInfo?.avatar" class="w-12 h-12">
                  <fluent-avatar :image="userInfo.avatar" :title="userInfo.nickname || userInfo.username">
                    <span slot="badge">{{ userInfo.nickname || userInfo.username }}</span>
                  </fluent-avatar>
                </div>
                <div v-else class="w-12 h-12">
                  <fluent-badge appearance="accent"
                    class="w-full h-full flex items-center justify-center text-xl font-medium">
                    {{ getInitials(userInfo?.nickname || userInfo?.username || '') }}
                  </fluent-badge>
                </div>
                <div class="flex flex-col gap-2">
                  <h2 class="text-2xl font-bold">{{ userInfo?.nickname || userInfo?.username }}</h2>
                  <div class="flex gap-4 text-neutral-600 dark:text-neutral-400">
                    <span>Rating: {{ userInfo?.rating || 0 }}</span>
                    <span>已解决: {{ userInfo?.solved || 0 }}</span>
                  </div>
                  <div class="text-neutral-600 dark:text-neutral-400">
                    <span>排名: #{{ userInfo?.ranking || '-' }}</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 self-end">
                <TokenItem class="cursor-pointer" Token="查看资料" Glyph="fluent:person-20-filled"
                  @click="router.push(`/profile/${userInfo?.username}`)" />
                <TokenItem class="cursor-pointer" Token="登出" Glyph="fluent:sign-out-20-filled" @click="handleLogout" />
              </div>
            </div>

            <!-- 最近提交 -->
            <div v-if="loading.userDetail" class="flex justify-center py-4">
              <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="error.userDetail" class="text-red-500 text-center text-sm py-2">
              {{ error.userDetail }}
            </div>
            <div v-else-if="userInfo?.recentSubmissions && userInfo.recentSubmissions.length > 0" class="mt-2">
              <RecentSubmissions :maxCount="3" :showQuestionLink="true" :showViewAllButton="true" 
                title="最近提交" :submissions="userInfo.recentSubmissions" />
            </div>
            <div v-else class="mt-2 text-center py-3 text-neutral-500 text-sm">
              暂无提交记录
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
      <!--
        <div
          class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">排行榜</h2>
          </div>
          <div class="flex flex-col">
            <div v-for="user in topUsers" :key="user.rank"
              class="flex items-center justify-between py-3 border-b-1 border-neutral-200 dark:border-neutral-700 last:border-0">
              <div class="flex items-center gap-3">
                <span class="font-bold w-6">{{ user.rank }}</span>
                添加头像/徽章
                <div class="w-8 h-8 flex items-center">
                  <div v-if="user.avatar" class="w-full h-full">
                    <fluent-avatar :image="user.avatar" :title="user.username">
                    </fluent-avatar>
                  </div>
                  <div v-else class="w-full h-full">
                    <fluent-badge appearance="accent"
                      class="w-full h-full flex items-center justify-center text-sm font-medium">
                      {{ getInitials(user.username) }}
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
      
      -->
    </div>
      <!-- 右侧面板：题目列表和比赛 -->
      <div class="md:w-2/3 flex flex-col gap-6">
        <!-- 题目列表 -->
        <div
          class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">推荐题目</h2>
            <fluent-button @click="navigate('/questions')"
              class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              查看全部
            </fluent-button>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading.problems" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="error.problems" class="text-center py-10 text-red-500">
            {{ error.problems }}
          </div>

          <!-- 数据为空 -->
          <div v-else-if="recommendedProblems.length === 0" class="text-center py-10 text-neutral-500">
            暂无推荐题目
          </div>

          <!-- 题目列表 -->
          <div v-else class="grid grid-cols-1">
            <div v-for="problem in recommendedProblems" :key="problem.id" @click="navigate(`/questions/${problem.id}`)"
              class="flex justify-between items-center p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors rounded-lg">
              <div class="flex items-center gap-3">
                <span class="font-medium text-blue-600 dark:text-blue-400">{{ problem.id }}</span>
                <span>{{ problem.title }}</span>
              </div>
              <div class="flex items-center gap-4">
                <span :class="{
                  'text-green-600 dark:text-green-400': problem.difficulty === '入门',
                  'text-blue-600 dark:text-blue-400': problem.difficulty === '简单',
                  'text-yellow-600 dark:text-yellow-400': problem.difficulty === '中等',
                  'text-red-600 dark:text-red-400': problem.difficulty === '困难'
                }">{{ problem.difficulty }}</span>
                <span class="text-neutral-600 dark:text-neutral-400">{{ problem.acceptance }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近比赛 -->
        <div
          class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">最近比赛</h2>
            <fluent-button @click="navigate('/contests')"
              class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              查看全部
            </fluent-button>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading.contests" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="error.contests" class="text-center py-10 text-red-500">
            {{ error.contests }}
          </div>

          <!-- 数据为空 -->
          <div v-else-if="recentContests.length === 0" class="text-center py-10 text-neutral-500">
            暂无近期比赛
          </div>

          <!-- 比赛列表 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="contest in recentContests" :key="contest.id" @click="navigate(`contests/${contest.id}`)"
              class="bg-neutral-50 dark:bg-neutral-800 rounded-lg border-1 border-neutral-200 dark:border-neutral-700 p-6 hover:border-blue-500 transition-colors cursor-pointer group">
              <div class="flex justify-between items-start">
                <h3 class="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{
                  contest.title }}</h3>
                <TokenItem :Token="contest.status"
                  :Glyph="contest.status === '即将开始' ? 'fluent:calendar-clock-20-filled' :
                    contest.status === '进行中' ? 'fluent:play-circle-20-filled' : 'fluent:checkmark-circle-20-filled'" />
              </div>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{{ contest.startTime }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
