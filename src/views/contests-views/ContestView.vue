<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import TokenItem from '@/components/TokenItem.vue'
import { getContestById, joinContest, getContestRankings, type ContestDetail, type ContestRanking } from '@/api/contestApi'
import { getQuestionById } from '@/api/questionApi'  // 导入getQuestionById函数

const route = useRoute()
const router = useRouter()
const contestId = route.params.id as string

// 状态管理
const loading = ref(true)
const error = ref<string | null>(null)
const contest = ref<ContestDetail | null>(null)

// 比赛题目列表
const problems = ref<{
  id: string;
  problemid: string;
  title: string;
  difficulty: string;
  acceptance: string;
  solved: boolean;
}[]>([])

// 加载比赛详情
const loadContestDetail = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getContestById(contestId)
    
    if (response.success && response.data) {
      contest.value = response.data
      
      // 处理题目列表
      if (response.data.problems) {
        // 先创建基本题目列表
        const problemsList = response.data.problems.map(p => ({
          id: p.displayId,
          problemid: p.problemId,
          title: p.title || '加载中...', // 默认标题
          difficulty: p.difficulty || '未知', // 默认难度
          acceptance: '未知', // API未返回此字段
          solved: false // 需要从用户提交记录确定
        }))
        
        problems.value = problemsList
        
        // 使用Promise.all同时请求所有题目详情
        const problemDetailsPromises = problemsList.map(async (problem) => {
          try {
            const questionResponse = await getQuestionById(problem.problemid)
            if (questionResponse && questionResponse.success && questionResponse.data) {
              problem.title = questionResponse.data.title || problem.title
              problem.difficulty = questionResponse.data.difficulty || problem.difficulty
              
              // 注释掉接受率相关代码，因为后端没有正确维护这个值
              // if (questionResponse.data.acceptCount !== undefined && questionResponse.data.submitCount !== undefined && questionResponse.data.submitCount > 0) {
              //   const acceptanceRate = (questionResponse.data.acceptCount / questionResponse.data.submitCount * 100).toFixed(1)
              //   problem.acceptance = `${acceptanceRate}%`
              // }
            }
            return problem
          } catch (err) {
            console.error(`获取题目 ${problem.problemid} 详情失败:`, err)
            return problem
          }
        })
        
        // 等待所有题目详情加载完成
        await Promise.all(problemDetailsPromises)
      }

      problems.value.sort((a, b) => a.id.localeCompare(b.id))
      
      // 加载比赛排行榜数据
      await loadRankings()
    } else {
      error.value = response.message || '加载比赛详情失败'
    }
  } catch (err) {
    console.error('获取比赛详情失败:', err)
    error.value = '获取比赛详情时出错'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadContestDetail()
})

// 排行榜状态管理
const rankingsLoading = ref(false)
const rankingsError = ref<string | null>(null)
const rankings = ref<{
  rank: number;
  username: string;
  totalScore: number;
  solved: number;
  penalty: number;
  problemScores: {
    status: string;
    score: number;
    attempts: number;
  }[];
}[]>([])

// 加载排行榜数据
const loadRankings = async () => {
  rankingsLoading.value = true
  rankingsError.value = null
  
  try {
    const response = await getContestRankings(contestId)
    
    if (response.success && response.data) {
      // 转换API返回的排行榜数据为组件所需格式
      rankings.value = response.data.participants.map(participant => ({
        rank: participant.rank,
        username: participant.username,
        totalScore: participant.totalScore,
        solved: participant.solved,
        penalty: participant.penalty,
        problemScores: participant.problemScores.map(score => ({
          status: score.status,
          score: score.score,
          attempts: score.attempts
        }))
      }))
      
      // 更新当前用户信息
      const currentUserData = response.data.participants.find(p => 
        p.username === currentUser.value.username
      )
      
      if (currentUserData) {
        currentUser.value.isParticipant = true
      }
    } else {
      rankingsError.value = response.message || '加载排行榜失败'
    }
  } catch (err) {
    console.error('获取比赛排行榜失败:', err)
    rankingsError.value = '获取排行榜时出错'
  } finally {
    rankingsLoading.value = false
  }
}

// 当前选中的标签页
const activeTab = ref('problems')

const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
  return new Date(timeStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 计算持续时间字符串
const durationStr = computed(() => {
  if (!contest.value?.duration) return ''
  return `${contest.value.duration}小时`
})

// 添加当前用户信息
const currentUser = ref({
  username: 'current_user',
  isParticipant: false
})

// 计算比赛状态和剩余时间
const contestStatus = computed(() => {
  if (!contest.value) {
    return {
      status: '加载中',
      color: 'text-neutral-600 dark:text-neutral-400',
      icon: 'fluent:calendar-clock-20-filled',
      canViewProblems: false,
      canRegister: false,
      canParticipate: false
    }
  }

  const now = new Date()
  const start = new Date(contest.value.startTime)
  const end = new Date(contest.value.endTime)

  if (now < start) {
    return {
      status: '即将开始',
      color: 'text-blue-600 dark:text-blue-400',
      icon: 'fluent:calendar-clock-20-filled',
      canViewProblems: false,
      canRegister: true,
      canParticipate: false
    }
  } else if (now >= start && now < end) {
    return {
      status: '进行中',
      color: 'text-green-600 dark:text-green-400',
      icon: 'fluent:clock-20-filled',
      canViewProblems: true,
      canRegister: false,
      canParticipate: true
    }
  } else {
    return {
      status: '已结束',
      color: 'text-neutral-600 dark:text-neutral-400',
      icon: 'fluent:checkmark-circle-20-filled',
      canViewProblems: true,
      canRegister: false,
      canParticipate: false
    }
  }
})

const handleProblemClick = (problemId: string) => {
  window.scrollTo(0,0)
  router.push(`/questions/${problemId}/${contestId}/`)
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

// 添加获取分数显示样式的方法
const getScoreStyle = (score: { status: string, score: number }) => {
  if (score.status === 'AC') {
    return 'text-green-600 dark:text-green-400'
  }else if (score.status === 'PARTIAL') {
    return 'text-yellow-600 dark:text-yellow-400'
  } 
  else if (score.status === 'WA') {
    return 'text-red-600 dark:text-red-400'
  }
  return 'text-neutral-600 dark:text-neutral-400'
}

// 参赛状态
const joining = ref(false)
const joinError = ref<string | null>(null)

// 添加参赛相关方法
const handleParticipate = async () => {
  if (joining.value) return
  
  joining.value = true
  joinError.value = null
  
  try {
    const response = await joinContest(contestId)
    
    if (response.success) {
      currentUser.value.isParticipant = true
      // 可以显示参赛成功提示
    } else {
      joinError.value = response.message || '参赛失败，请稍后再试'
    }
  } catch (err) {
    console.error('参加比赛时出错:', err)
    joinError.value = '参加比赛时出错'
  } finally {
    joining.value = false
  }
}

// 获取当前用户排名信息
const currentUserRanking = computed(() => {
  return rankings.value.find(r => r.username === currentUser.value.username)
})

// 重试加载
const retryLoad = () => {
  loadContestDetail()
}

// 重试加载排行榜
const retryLoadRankings = () => {
  loadRankings()
}
</script>

<template>
  <div class="min-h-screen bg-neutral-100 dark:bg-neutral-900">
    <div class="container mx-auto px-4 py-6">
      <!-- 加载中状态 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
        <p>{{ error }}</p>
        <button 
          @click="retryLoad"
          class="mt-2 px-3 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded hover:bg-red-300 dark:hover:bg-red-700 transition"
        >
          重试
        </button>
      </div>

      <!-- 比赛详情内容 -->
      <template v-else-if="contest">
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
              <span>持续时间：{{ durationStr }}</span>
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

          <!-- 添加参赛按钮 -->
          <div v-if="!currentUser.isParticipant" class="mt-4">
            <!-- 显示参赛错误信息 -->
            <div v-if="joinError" class="mb-3 p-2 bg-red-100 dark:bg-red-900/20 rounded text-sm text-red-700 dark:text-red-400">
              {{ joinError }}
            </div>
            
            <button v-if="contestStatus.canParticipate"
                    @click="handleParticipate"
                    :disabled="joining"
                    class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 
                           text-white px-4 py-2 rounded-lg transition-colors duration-200 
                           flex items-center gap-2">
              <div v-if="joining" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <Icon v-else icon="fluent:add-20-filled" class="w-5 h-5" />
              {{ joining ? '正在加入...' : '参加比赛' }}
            </button>
            
            <button v-else-if="contestStatus.canRegister"
                    @click="handleParticipate"
                    :disabled="joining"
                    class="bg-green-600 hover:bg-green-700 disabled:bg-green-400 dark:disabled:bg-green-800
                           text-white px-4 py-2 rounded-lg transition-colors duration-200 
                           flex items-center gap-2">
              <div v-if="joining" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <Icon v-else icon="fluent:calendar-add-20-filled" class="w-5 h-5" />
              {{ joining ? '正在报名...' : '报名参赛' }}
            </button>
          </div>
          
          <div v-else class="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-400 flex items-center gap-2">
            <Icon icon="fluent:checkmark-circle-20-filled" class="w-5 h-5" />
            已成功参加比赛
          </div>
        </div>

        <!-- 标签页切换 -->
        <fluent-tablist>
          <fluent-tab 
            v-for="tab in [
              { id: 'problems', label: '题目', icon: 'fluent:document-20-filled', 
                show: contestStatus.canViewProblems },
              { id: 'rankings', label: '排行榜', icon: 'fluent:trophy-20-filled',
                show: true }
            ]"
            v-show="tab.show"
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
        </fluent-tablist>

        <!-- 比赛未开始提示 -->
        <div v-if="!contestStatus.canViewProblems && activeTab === 'problems'" 
             class="mt-6 p-8 text-center bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <Icon icon="fluent:lock-closed-20-filled" 
                class="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium mb-2">题目未解锁</h3>
          <p class="text-neutral-600 dark:text-neutral-400">
            比赛尚未开始，题目将在开始时解锁
          </p>
        </div>

        <!-- 题目列表 -->
        <div v-else-if="activeTab === 'problems' && contestStatus.canViewProblems" 
             class="mt-6">
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-z400 uppercase tracking-wider">
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
                    class="transition-colors cursor-pointer group dark:hover:bg-neutral-800 cursor-pointer transition-colors duration-200"
                    @click="handleProblemClick(problem.problemid)">
                  <td class="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors px-6 py-4 whitespace-nowrap">
                    {{ problem.id }} - {{ problem.problemid }}
                  </td>
                  <td class="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors px-6 py-4 whitespace-nowrap">
                    {{ problem.title }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getDifficultyColor(problem.difficulty)">
                      {{ problem.difficulty }}
                    </span>
                  </td>
                  <td class="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors px-6 py-4 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
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
          <!-- 加载中状态 -->
          <div v-if="rankingsLoading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="rankingsError" class="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            <p>{{ rankingsError }}</p>
            <button 
              @click="retryLoadRankings"
              class="mt-2 px-3 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded hover:bg-red-300 dark:hover:bg-red-700 transition"
            >
              重试
            </button>
          </div>

          <!-- 当前用户排名信息 -->
          <div v-else-if="currentUserRanking" 
              class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="text-neutral-600 dark:text-neutral-400">我的排名：</span>
                <span class="text-xl font-bold">第 {{ currentUserRanking.rank }} 名</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-neutral-600 dark:text-neutral-400">总分：</span>
                <span class="text-xl font-bold">{{ currentUserRanking.totalScore }}</span>
              </div>
            </div>
          </div>
          
          <!-- 排行榜表格 -->
          <div v-if="!rankingsLoading && !rankingsError" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead class="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    排名
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    用户
                  </th>
                  <th v-for="problem in problems" 
                      :key="problem.id" 
                      class="px-4 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {{ problem.id }}
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    总分
                  </th>
                  <!-- 罚时列已移除 -->
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                <tr v-for="user in rankings" :key="user.rank"
                    class="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <Icon v-if="user.rank <= 3"
                            :icon="[
                              'fluent:crown-20-filled',
                              'fluent:trophy-20-filled',
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
                  <td v-for="(score, index) in user.problemScores" 
                      :key="index"
                      class="px-4 py-4 text-center whitespace-nowrap"
                      :class="getScoreStyle(score)">
                    <template v-if="score.status !== '-'">
                      {{ score.score }}
                      <span class="text-xs" v-if="score.attempts > 1">({{score.attempts}})</span>
                    </template>
                    <template v-else>
                      <!-- 未尝试题目不显示任何内容 -->
                    </template>
                  </td>
                  <td class="px-6 py-4 text-center whitespace-nowrap font-medium">
                    {{ user.totalScore }}
                  </td>
                  <!-- 罚时单元格已移除 -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
:deep(fluent-tablist) {
  --background-color: var(--neutral-layer-1);
  border-bottom: 1px solid var(--neutral-stroke-divider-rest);
}

:deep(fluent-tab) {
  --background-color: var(--neutral-layer-1);
  --hover-background-color: var(--neutral-layer-2);
  padding: 8px 16px;
}

:deep(fluent-tab[selected]) {
  --background-color: var(--neutral-layer-2);
  border-bottom: 2px solid var(--accent-fill-rest);
}
</style>
