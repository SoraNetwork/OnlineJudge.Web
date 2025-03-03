<script setup lang="ts">
import TokenItem from "@/components/TokenItem.vue";
import { Icon } from "@iconify/vue";
import { ref, onMounted } from "vue";
import { getUserProfile } from "@/api/userApi";
import { userInfo as currentUserInfo, isLoggedIn } from "@/stores/userStore";

// 接收路由参数
const props = defineProps({
  username: {
    type: String,
    default: '',
  },
});

document.title = "Sora Online Judge • 个人资料";

// 定义用户资料类型
interface Badge {
  name: string;
  icon: string;
  description: string;
}

interface Activity {
  type: string;
  problem?: string;
  contest?: string;
  title?: string;
  result: string;
  time: string;
}

interface ProblemTag {
  name: string;
  count: number;
}

interface RatingRecord {
  date: string;
  rating: number;
}

// 用户信息状态
const userInfo = ref({
  nickname: "" ,
  username: "",
  email: "",
  rating: 0,
  rank: 0,
  joinDate: "",
  stats: {
    solved: 0,
    attempted: 0,
    submissions: 0,
    acceptanceRate: "0%",
  },
  badges: [] as Badge[],
  recentActivity: [] as Activity[],
  problemTags: [] as ProblemTag[],
  ratingHistory: [] as RatingRecord[]
});

const isLoading = ref(true);
const error = ref("");

// 获取用户资料
const fetchUserProfile = async (userId: string) => {
  try {
    isLoading.value = true;
    error.value = "";
    
    const response = await getUserProfile(userId);
    
    if (response.success && response.data) {
      // 更新用户信息，确保所有必要的属性都有默认值
      userInfo.value = {
        nickname: response.data.nickname || "",
        username: response.data.username,
        email: response.data.email || "",
        rating: response.data.rating || 0,
        rank: response.data.ranking || 0,
        joinDate: response.data.joinDate || "",
        stats: response.data.stats || {
          solved: 0,
          attempted: 0,
          submissions: 0,
          acceptanceRate: "0%",
        },
        badges: response.data.badges || [],
        recentActivity: response.data.recentActivity || [],
        problemTags: response.data.problemTags || [],
        ratingHistory: response.data.ratingHistory || []
      };
      
      // 设置页面标题
      document.title = `Sora Online Judge • ${userInfo.value.username} 的个人资料`;
    } else {
      error.value = response.message || "获取用户资料失败";
    }
  } catch (err) {
    console.error("获取用户资料时发生错误:", err);
    error.value = "加载用户资料时出错，请稍后再试";
  } finally {
    isLoading.value = false;
  }
};

// 当组件挂载时获取用户信息
onMounted(async () => {
  // 如果没有提供username，使用当前登录用户
  if (!props.username) {
    if (isLoggedIn.value && currentUserInfo.value) {
      await fetchUserProfile(currentUserInfo.value.username);
    } else {
      error.value = "请先登录";
      isLoading.value = false;
    }
  } else {
    // 获取指定用户的信息
    await fetchUserProfile(props.username);
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 p-8">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <div class="flex flex-col items-center gap-4">
        <Icon icon="fluent:spinner-ios-20-regular" class="w-8 h-8 animate-spin text-blue-600" />
        <span>加载用户资料中...</span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="flex justify-center items-center min-h-[400px]">
      <div class="flex flex-col items-center gap-4 text-red-500">
        <Icon icon="fluent:error-circle-20-filled" class="w-8 h-8" />
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- 用户资料内容 -->
    <template v-else>
      <!-- 基本信息卡片 -->
      <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <h1 class="text-3xl font-bold">{{ userInfo.nickname  }}</h1>
              <TokenItem :Token="`Rating: ${userInfo.rating}`" Glyph="fluent:trophy-20-filled" />
            </div>
            <div class="flex flex-col gap-2 text-neutral-600 dark:text-neutral-400">
              <div class="flex items-center gap-2" v-if="userInfo.email">
                <Icon icon="fluent:mail-20-regular" class="w-5 h-5" />
                <span>{{ userInfo.email }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon icon="fluent:calendar-20-regular" class="w-5 h-5" />
                <span>加入时间：{{ userInfo.joinDate }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="flex flex-col items-center p-4 rounded-lg bg-neutral-100 dark:bg-neutral-700">
              <span class="text-2xl font-bold">{{ userInfo.stats.solved }}</span>
              <span class="text-sm text-neutral-600 dark:text-neutral-400">已解决</span>
            </div>
            <div class="flex flex-col items-center p-4 rounded-lg bg-neutral-100 dark:bg-neutral-700">
              <span class="text-2xl font-bold">{{ userInfo.stats.attempted }}</span>
              <span class="text-sm text-neutral-600 dark:text-neutral-400">尝试过</span>
            </div>
            <div class="flex flex-col items-center p-4 rounded-lg bg-neutral-100 dark:bg-neutral-700">
              <span class="text-2xl font-bold">{{ userInfo.stats.submissions }}</span>
              <span class="text-sm text-neutral-600 dark:text-neutral-400">总提交</span>
            </div>
            <div class="flex flex-col items-center p-4 rounded-lg bg-neutral-100 dark:bg-neutral-700">
              <span class="text-2xl font-bold">{{ userInfo.stats.acceptanceRate }}</span>
              <span class="text-sm text-neutral-600 dark:text-neutral-400">通过率</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <!-- 左侧面板：成就和活动 -->
        <div class="flex flex-col gap-6 md:w-2/3">
          <!-- 成就徽章 -->
          <div v-if="userInfo.badges && userInfo.badges.length > 0" 
               class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
            <h2 class="text-xl font-bold mb-4">成就徽章</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="badge in userInfo.badges" :key="badge.name"
                class="flex items-center gap-3 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-700">
                <Icon :icon="badge.icon" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <div class="font-semibold">{{ badge.name }}</div>
                  <div class="text-sm text-neutral-600 dark:text-neutral-400">{{ badge.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最近活动 -->
          <div v-if="userInfo.recentActivity && userInfo.recentActivity.length > 0"
               class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
            <h2 class="text-xl font-bold mb-4">最近活动</h2>
            <div class="flex flex-col gap-4">
              <div v-for="activity in userInfo.recentActivity" :key="activity.time"
                class="flex items-center justify-between py-3 border-b-1 border-neutral-200 dark:border-neutral-700 last:border-0">
                <div class="flex items-center gap-4">
                  <TokenItem :Token="activity.type" 
                    :Glyph="activity.type === '提交' ? 'fluent:code-20-regular' : 'fluent:trophy-20-filled'" />
                  <div class="flex flex-col">
                    <span class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      {{ activity.problem || activity.contest }}
                    </span>
                    <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ activity.time }}</span>
                  </div>
                </div>
                <TokenItem :Token="activity.result"
                  :Glyph="activity.result.includes('通过') ? 'fluent:checkmark-circle-20-filled' : 
                         activity.result.includes('未通过') ? 'fluent:dismiss-circle-20-filled' : 'fluent:trophy-20-filled'" />
              </div>
            </div>
          </div>

          <div v-if="!userInfo.badges?.length && !userInfo.recentActivity?.length"
               class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6 text-center">
            <p class="text-neutral-600 dark:text-neutral-400">暂无活动记录</p>
          </div>
        </div>

        <!-- 右侧面板：统计信息 -->
        <div class="flex flex-col gap-6 md:w-1/3">
          <!-- 解题分布 -->
          <div v-if="userInfo.problemTags && userInfo.problemTags.length > 0"
               class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
            <h2 class="text-xl font-bold mb-4">解题分布</h2>
            <div class="flex flex-col gap-3">
              <div v-for="tag in userInfo.problemTags" :key="tag.name"
                class="flex items-center justify-between">
                <span>{{ tag.name }}</span>
                <div class="flex items-center gap-2">
                  <div class="w-24 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div class="h-full rounded-full bg-blue-600 dark:bg-blue-400"
                      :style="{ width: `${userInfo.stats && userInfo.stats.solved > 0 ? (tag.count / userInfo.stats.solved * 100) : 0}%` }">
                    </div>
                  </div>
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ tag.count }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Rating 变化 -->
          <div v-if="userInfo.ratingHistory && userInfo.ratingHistory.length > 0"
               class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
            <h2 class="text-xl font-bold mb-4">Rating 历史</h2>
            <div class="flex flex-col gap-3">
              <div v-for="record in userInfo.ratingHistory" :key="record.date"
                class="flex items-center justify-between py-2 border-b-1 border-neutral-200 dark:border-neutral-700 last:border-0">
                <span>{{ record.date }}</span>
                <span class="font-semibold">{{ record.rating }}</span>
              </div>
            </div>
          </div>

          <div v-if="!userInfo.problemTags?.length && !userInfo.ratingHistory?.length"
               class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6 text-center">
            <p class="text-neutral-600 dark:text-neutral-400">暂无统计数据</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>