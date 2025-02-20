<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import TokenItem from '@/components/TokenItem.vue'

const route = useRoute()
const router = useRouter()
const contestId = route.params.id

// 比赛信息
const contest = ref({
  id: contestId,
  title: 'SOJ 周赛 #1',
  description: '每周例行算法练习赛，适合新手参与。题目难度递增，帮助选手逐步提升解题能力。',
  startTime: '2024-02-01 14:00:00',
  endTime: '2024-02-01 16:00:00',
  duration: '2小时',
  status: '即将开始',
  type: '公开赛',
  difficulty: '简单',
  participants: 128,
  rules: [
    '比赛时间为2小时',
    '可以使用任何编程语言',
    '禁止使用任何外部代码库',
    '禁止讨论题目解法',
    '成绩将在比赛结束后公布'
  ]
})

// 题目列表
const problems = ref([
  { id: 'A', title: '两数之和', difficulty: '入门', acceptance: '95%', solved: false },
  { id: 'B', title: '链表反转', difficulty: '简单', acceptance: '85%', solved: false },
  { id: 'C', title: '二叉树遍历', difficulty: '中等', acceptance: '65%', solved: false },
  { id: 'D', title: '最短路径', difficulty: '困难', acceptance: '35%', solved: false }
])

// 排行榜
const rankings = ref([
  { rank: 1, username: 'user1', score: 400, solved: 4, penalty: 240 },
  { rank: 2, username: 'user2', score: 300, solved: 3, penalty: 180 },
  { rank: 3, username: 'user3', score: 200, solved: 2, penalty: 150 },
  { rank: 4, username: 'user4', score: 100, solved: 1, penalty: 60 }
])

// 当前选中的标签页
const activeTab = ref('problems')

const formatTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 计算比赛状态和剩余时间
const contestStatus = computed(() => {
  const now = new Date()
  const start = new Date(contest.value.startTime)
  const end = new Date(contest.value.endTime)

  if (now < start) {
    return {
      status: '即将开始',
      color: 'text-blue-600 dark:text-blue-400',
      icon: 'fluent:calendar-clock-20-filled'
    }
  } else if (now >= start && now < end) {
    return {
      status: '进行中',
      color: 'text-green-600 dark:text-green-400',
      icon: 'fluent:clock-20-filled'
    }
  } else {
    return {
      status: '已结束',
      color: 'text-neutral-600 dark:text-neutral-400',
      icon: 'fluent:checkmark-circle-20-filled'
    }
  }
})

const handleProblemClick = (problemId: string) => {
  router.push(`/contest/${contestId}/problem/${problemId}`)
}

const getDifficultyColor = (difficulty: string) => {
  const colors = {
    '入门': 'text-green-600 dark:text-green-400',
    '简单': 'text-blue-600 dark:text-blue-400',
    '中等': 'text-yellow-600 dark:text-yellow-400',
    '困难': 'text-red-600 dark:text-red-400'
  }
  return colors[difficulty as keyof typeof colors] || ''
}
</script>

<template>
  <div class="min-h-screen bg-neutral-100 dark:bg-neutral-900">
    <div class="container mx-auto px-4 py-6">
      <!-- 比赛基本信息 -->
      <div class="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 mb-6">
        <div class="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold mb-2">{{ contest.title }}</h1>
            <p class="text-neutral-600 dark:text-neutral-400">
              {{ contest.description }}
            </p>
          </div>
          <div class="flex items-start gap-2">
            <span :class="[
              'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
              contestStatus.color
            ]">
              <Icon :icon="contestStatus.icon" class="w-5 h-5" />
              {{ contestStatus.status }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Icon icon="fluent:calendar-20-filled" class="w-5 h-5" />
            <span>开始时间：{{ formatTime(contest.startTime) }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Icon icon="fluent:timer-20-filled" class="w-5 h-5" />
            <span>持续时间：{{ contest.duration }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Icon icon="fluent:people-20-filled" class="w-5 h-5" />
            <span>参与人数：{{ contest.participants }}</span>
          </div>
          <div class="flex items-center gap-2">
            <TokenItem :Token="contest.type" Glyph="fluent:tag-20-filled" />
            <TokenItem :Token="contest.difficulty" Glyph="fluent:target-20-filled" />
          </div>
        </div>

        <!-- 比赛规则 -->
        <div class="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4">
          <h3 class="text-lg font-medium mb-3 flex items-center gap-2">
            <Icon icon="fluent:shield-20-filled" class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            比赛规则
          </h3>
          <ul class="list-disc list-inside space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li v-for="(rule, index) in contest.rules" :key="index">{{ rule }}</li>
          </ul>
        </div>
      </div>

      <!-- 标签页切换 -->
      <fluent-tabs>
        <fluent-tab
          v-for="tab in [
            { id: 'problems', label: '题目', icon: 'fluent:document-20-filled' },
            { id: 'rankings', label: '排行榜', icon: 'fluent:trophy-20-filled' }
          ]"
          :key="tab.id"
          :id="tab.id"
          :selected="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          <div class="flex items-center gap-2">
            <Icon :icon="tab.icon" class="w-5 h-5" />
            {{ tab.label }}
          </div>
        </fluent-tab>
      </fluent-tabs>

      <!-- 题目列表 -->
      <div v-if="activeTab === 'problems'" class="mt-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead class="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  题号
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  题目
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  难度
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  通过率
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  状态
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
              <tr v-for="problem in problems" 
                  :key="problem.id"
                  class="hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                  @click="handleProblemClick(problem.id)">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ problem.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ problem.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getDifficultyColor(problem.difficulty)">
                    {{ problem.difficulty }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                  {{ problem.acceptance }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Icon v-if="problem.solved"
                        icon="fluent:checkmark-circle-20-filled"
                        class="w-5 h-5 text-green-600 dark:text-green-400" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 排行榜 -->
      <div v-else-if="activeTab === 'rankings'" class="mt-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead class="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  排名
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  用户
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  解题数
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  总分
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  罚时
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
              <tr v-for="user in rankings" :key="user.rank"
                  class="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <Icon v-if="user.rank <= 3"
                          :icon="[
                            'fluent:trophy-20-filled',
                            'fluent:medal-20-filled',
                            'fluent:ribbon-20-filled'
                          ][user.rank - 1]"
                          :class="[
                            'w-5 h-5',
                            user.rank === 1 ? 'text-yellow-400' :
                            user.rank === 2 ? 'text-neutral-400' :
                            'text-orange-400'
                          ]" />
                    <span v-else>{{ user.rank }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ user.username }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ user.solved }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ user.score }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                  {{ user.penalty }}分钟
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(fluent-tabs) {
  --background-color: var(--neutral-layer-1);
}

:deep(fluent-tab) {
  --background-color: var(--neutral-layer-1);
  --hover-background-color: var(--neutral-layer-2);
}

:deep(fluent-tab[selected]) {
  --background-color: var(--neutral-layer-2);
}
</style>
