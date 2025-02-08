<script setup lang="ts">
import TokenItem from "@/components/TokenItem.vue";
import { Icon } from "@iconify/vue";
import { ref, onMounted } from "vue";

// 接收路由参数
const props = defineProps({
  username: {
    type: String,
    default: '',
  },
});

document.title = "Sora Online Judge • 个人资料";

// 根据 username 参数获取用户信息
// 实际使用时应该从 API 获取数据
const userInfo = ref({
  username: "XingSora",
  email: "xingsora@example.com",
  rating: 1800,
  rank: 42,
  joinDate: "2023-12-01",
  stats: {
    solved: 128,
    attempted: 156,
    submissions: 342,
    acceptanceRate: "82%",
  },
  badges: [
    { name: "初来乍到", icon: "fluent:hat-graduation-20-filled", description: "成功注册账号" },
    { name: "解题达人", icon: "fluent:trophy-20-filled", description: "解决超过100道题目" },
    { name: "连胜王者", icon: "fluent:star-20-filled", description: "连续提交5次全部通过" },
  ],
  recentActivity: [
    { type: "提交", problem: "P1001", title: "A + B Problem", result: "通过", time: "2024-01-28 15:30" },
    { type: "参赛", contest: "每周算法练习赛 #1", result: "排名 #5", time: "2024-01-27 20:00" },
    { type: "提交", problem: "P1002", title: "过河卒", result: "未通过", time: "2024-01-26 14:20" },
  ],
  problemTags: [
    { name: "动态规划", count: 45 },
    { name: "图论", count: 32 },
    { name: "数据结构", count: 28 },
    { name: "贪心", count: 23 },
  ],
  ratingHistory: [
    { date: "2023-12", rating: 1500 },
    { date: "2024-01", rating: 1800 },
  ]
});

// 如果没有提供 username，可以获取当前登录用户的信息
onMounted(() => {
  if (!props.username) {
    // 获取当前登录用户信息
    // getUserInfo();
  } else {
    // 获取指定用户信息
    // getUserInfoByUsername(props.username);
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 p-8">
    <!-- 基本信息卡片 -->
    <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4">
            <h1 class="text-3xl font-bold">{{ userInfo.username }}</h1>
            <TokenItem :Token="`Rating: ${userInfo.rating}`" Glyph="fluent:trophy-20-filled" />
          </div>
          <div class="flex flex-col gap-2 text-neutral-600 dark:text-neutral-400">
            <div class="flex items-center gap-2">
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
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
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
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
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
      </div>

      <!-- 右侧面板：统计信息 -->
      <div class="flex flex-col gap-6 md:w-1/3">
        <!-- 解题分布 -->
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <h2 class="text-xl font-bold mb-4">解题分布</h2>
          <div class="flex flex-col gap-3">
            <div v-for="tag in userInfo.problemTags" :key="tag.name"
              class="flex items-center justify-between">
              <span>{{ tag.name }}</span>
              <div class="flex items-center gap-2">
                <div class="w-24 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div class="h-full rounded-full bg-blue-600 dark:bg-blue-400"
                    :style="{ width: `${(tag.count / userInfo.stats.solved * 100)}%` }">
                  </div>
                </div>
                <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ tag.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Rating 变化 -->
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <h2 class="text-xl font-bold mb-4">Rating 历史</h2>
          <div class="flex flex-col gap-3">
            <div v-for="record in userInfo.ratingHistory" :key="record.date"
              class="flex items-center justify-between py-2 border-b-1 border-neutral-200 dark:border-neutral-700 last:border-0">
              <span>{{ record.date }}</span>
              <span class="font-semibold">{{ record.rating }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 