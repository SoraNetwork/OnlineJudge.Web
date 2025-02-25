<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import TokenItem from "@/components/TokenItem.vue";

document.title = "Sora Online Judge • 团队详情";

const teamInfo = ref({
  id: 1,
  name: "ACM 校队",
  avatar: "",
  description: "校 ACM 竞赛队，专注于算法竞赛训练。我们定期组织培训、模拟赛，致力于提高成员的竞赛水平。",
  createTime: "2023-12-01",
  members: 25,
  leader: "tourist",
  tags: ["竞赛", "算法"],
  announcement: "本周六下午2点进行ICPC模拟赛，请大家准时参加。",
  statistics: {
    totalProblems: 520,
    weeklyActive: 18,
    avgRating: 1842
  }
});

const members = ref([
  { username: "tourist", role: "队长", rating: 3000, solved: 520, lastActive: "2024-01-28" },
  { username: "jiangly", role: "教练", rating: 2800, solved: 480, lastActive: "2024-01-28" },
  { username: "XingSora", role: "成员", rating: 2200, solved: 350, lastActive: "2024-01-27" },
]);

const problemsets = ref([
  { id: 1, name: "基础训练", problems: 50, completed: 35 },
  { id: 2, name: "动态规划进阶", problems: 30, completed: 20 },
  { id: 3, name: "图论专题", problems: 40, completed: 15 },
]);

const rankings = ref([
  { rank: 1, username: "tourist", rating: 3000, weeklyScore: 150 },
  { rank: 2, username: "jiangly", rating: 2800, weeklyScore: 120 },
  { rank: 3, username: "XingSora", rating: 2200, weeklyScore: 100 },
]);

const activeTab = ref('intro'); // intro, members, rankings, problems

const getInitials = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

// 添加团内竞赛数据
const teamContests = ref([
  {
    id: 1,
    title: "ICPC 模拟赛 #1",
    startTime: "2024-02-03 14:00",
    duration: "5小时",
    participants: 18,
    status: "即将开始"
  },
  {
    id: 2,
    title: "周末练习赛 #5",
    startTime: "2024-01-28 19:00",
    duration: "3小时",
    participants: 22,
    status: "已结束",
    topRanks: [
      { username: "tourist", score: 500 },
      { username: "jiangly", score: 400 },
      { username: "XingSora", score: 300 }
    ]
  }
]);

// 标签页配置
const tabs = {
  intro: { label: '介绍', icon: 'fluent:info-20-regular' },
  members: { label: '成员', icon: 'fluent:people-20-regular' },
  rankings: { label: '排行', icon: 'fluent:trophy-20-regular' },
  problems: { label: '题库', icon: 'fluent:book-20-regular' },
  contests: { label: '竞赛', icon: 'fluent:calendar-star-20-regular' }
};

// 处理标签切换
const currentTab = ref('intro');

const handleTabChange = (e: CustomEvent) => {
  const newTab = e.target as HTMLElement;
  currentTab.value = newTab.id;
};
</script>

<template>
  <div class="flex flex-col p-8 gap-6">
    <!-- 团队基本信息 -->
    <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
      <div class="flex gap-6">
        <!-- 团队头像 -->
        <div class="w-24 h-24">
          <div v-if="teamInfo.avatar" class="w-full h-full">
            <fluent-avatar :image="teamInfo.avatar" :title="teamInfo.name" />
          </div>
          <div v-else class="w-full h-full">
            <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-3xl font-medium">
              {{ getInitials(teamInfo.name) }}
            </fluent-badge>
          </div>
        </div>

        <div class="flex-1">
          <div class="flex justify-between">
            <div>
              <h1 class="text-2xl font-bold">{{ teamInfo.name }}</h1>
              <div class="flex gap-2 mt-2">
                <fluent-badge v-for="tag in teamInfo.tags" :key="tag" appearance="outline">
                  {{ tag }}
                </fluent-badge>
              </div>
            </div>
            <fluent-button appearance="accent">
              申请加入
            </fluent-button>
          </div>

          <p class="mt-4 text-neutral-600 dark:text-neutral-400">{{ teamInfo.description }}</p>

          <div class="flex gap-6 mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            <span class="flex items-center gap-1">
              <Icon icon="fluent:person-20-regular" />
              队长：{{ teamInfo.leader }}
            </span>
            <span class="flex items-center gap-1">
              <Icon icon="fluent:people-20-regular" />
              成员：{{ teamInfo.members }}
            </span>
            <span class="flex items-center gap-1">
              <Icon icon="fluent:calendar-20-regular" />
              创建时间：{{ teamInfo.createTime }}
            </span>
          </div>
        </div>
      </div>

      <!-- 团队数据统计 -->
      <div class="grid grid-cols-3 gap-4 mt-6">
        <div class="flex flex-col items-center p-4 rounded-lg bg-neutral-100 dark:bg-neutral-700">
          <span class="text-2xl font-bold">{{ teamInfo.statistics.totalProblems }}</span>
          <span class="text-sm text-neutral-600 dark:text-neutral-400">题目总数</span>
        </div>
        <div class="flex flex-col items-center p-4 rounded-lg bg-neutral-100 dark:bg-neutral-700">
          <span class="text-2xl font-bold">{{ teamInfo.statistics.weeklyActive }}</span>
          <span class="text-sm text-neutral-600 dark:text-neutral-400">本周活跃</span>
        </div>
        <div class="flex flex-col items-center p-4 rounded-lg bg-neutral-100 dark:bg-neutral-700">
          <span class="text-2xl font-bold">{{ teamInfo.statistics.avgRating }}</span>
          <span class="text-sm text-neutral-600 dark:text-neutral-400">平均Rating</span>
        </div>
      </div>
    </div>

    <!-- 公告 -->
    <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
      <div class="flex items-center gap-2 text-xl font-bold mb-4">
        <Icon icon="fluent:megaphone-20-filled" class="w-6 h-6" />
        公告
      </div>
      <p class="text-neutral-600 dark:text-neutral-400">{{ teamInfo.announcement }}</p>
    </div>

    <!-- 使用 fluent-tabs 和 v-if 控制内容显示 -->
    <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
      <fluent-tabs>
        <fluent-tablist>
          <fluent-tab v-for="(config, id) in tabs" :key="id" :id="id" @click="handleTabChange">
            <div class="flex items-center gap-2">
              <Icon :icon="config.icon" />
              {{ config.label }}
            </div>
          </fluent-tab>
        </fluent-tablist>
      </fluent-tabs>

      <!-- 内容区域使用 v-if 控制显示 -->
      <div class="p-4">
        <!-- 介绍 -->
        <div v-if="currentTab === 'intro'" class="text-neutral-600 dark:text-neutral-400">
          <p>{{ teamInfo.description }}</p>
        </div>

        <!-- 成员列表 -->
        <div v-if="currentTab === 'members'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="member in members" :key="member.username"
            class="p-4 rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12">
                <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-lg font-medium">
                  {{ getInitials(member.username) }}
                </fluent-badge>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ member.username }}</span>
                  <TokenItem :Token="member.role" />
                </div>
                <div class="flex justify-between mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <span>Rating: {{ member.rating }}</span>
                  <span>已解决: {{ member.solved }}</span>
                  <span>最后活跃: {{ member.lastActive }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 排行榜 -->
        <div v-if="currentTab === 'rankings'">
          <table class="w-full">
            <thead>
              <tr class="border-b-1 border-neutral-300 dark:border-neutral-700">
                <th class="px-6 py-3 text-left">排名</th>
                <th class="px-6 py-3 text-left">用户名</th>
                <th class="px-6 py-3 text-left">Rating</th>
                <th class="px-6 py-3 text-left">本周得分</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in rankings" :key="user.username"
                class="border-b-1 border-neutral-300 dark:border-neutral-700">
                <td class="px-6 py-4">{{ user.rank }}</td>
                <td class="px-6 py-4">{{ user.username }}</td>
                <td class="px-6 py-4">{{ user.rating }}</td>
                <td class="px-6 py-4">{{ user.weeklyScore }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 题库 -->
        <div v-if="currentTab === 'problems'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="problemset in problemsets" :key="problemset.id"
            class="p-4 rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
            <div class="flex justify-between items-center">
              <h3 class="font-medium">{{ problemset.name }}</h3>
              <span class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ problemset.completed }}/{{ problemset.problems }}
              </span>
            </div>
            <div class="mt-3 w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div class="h-full rounded-full bg-blue-600"
                :style="{ width: `${(problemset.completed / problemset.problems * 100)}%` }">
              </div>
            </div>
          </div>
        </div>

        <!-- 竞赛列表 -->
        <div v-if="currentTab === 'contests'" class="flex flex-col gap-6">
          <!-- 创建竞赛按钮 -->
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">团队竞赛</h2>
            <fluent-button appearance="accent">
              <Icon icon="fluent:calendar-add-20-filled" class="w-5 h-5 mr-2" />
              创建竞赛
            </fluent-button>
          </div>

          <!-- 竞赛卡片列表 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="contest in teamContests" :key="contest.id"
              class="p-6 rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:border-blue-500 cursor-pointer transition-colors">
              <div class="flex flex-col gap-4">
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-medium">{{ contest.title }}</h3>
                  <TokenItem :Token="contest.status" 
                    :Glyph="contest.status === '即将开始' ? 'fluent:clock-20-filled' : 'fluent:checkmark-circle-20-filled'" />
                </div>

                <div class="flex flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div class="flex items-center gap-2">
                    <Icon icon="fluent:calendar-20-regular" />
                    开始时间：{{ contest.startTime }}
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="fluent:timer-20-regular" />
                    时长：{{ contest.duration }}
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="fluent:people-20-regular" />
                    参与人数：{{ contest.participants }}
                  </div>
                </div>

                <!-- 显示已结束竞赛的排名 -->
                <div v-if="contest.status === '已结束' && contest.topRanks" 
                  class="mt-2 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700">
                  <div class="text-sm font-medium mb-2">TOP 3</div>
                  <div class="flex flex-col gap-2">
                    <div v-for="(rank, index) in contest.topRanks" :key="rank.username"
                      class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <TokenItem :Token="`#${index + 1}`" />
                        <span>{{ rank.username }}</span>
                      </div>
                      <span class="font-medium">{{ rank.score }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
fluent-tab {
  height: 48px;
  padding: 0 16px;
}

fluent-tab[aria-selected="true"] {
  color: var(--accent-foreground-rest);
}

fluent-tab-panel {
  padding: 0;
}
</style>
