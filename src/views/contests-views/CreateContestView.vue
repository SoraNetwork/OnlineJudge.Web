<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import TokenItem from '@/components/TokenItem.vue'
import { Dialog } from '@fluentui/web-components'

const router = useRouter()

// 比赛表单数据
const contestForm = ref({
  title: '',
  description: '',
  startTime: '',
  endTime: '',   // 新增结束时间
  duration: '2', // 现在作为计算值
  type: '公开赛', // 公开赛、私密赛
  difficulty: '简单', // 入门、简单、中等、困难
  rules: [
    '比赛时间为2小时',
    '可以使用任何编程语言', 
    '禁止使用任何外部代码库',
    '禁止讨论题目解法',
  ],
  problems: [
    { 
      problemId: null as number | null, // 实际题目ID
      displayId: 'A', // 比赛中显示的题号
      title: '', 
      difficulty: '入门',
      score: 100 
    }
  ],
  visibility: {
    type: 'public', // public, team, private
    teams: [] as number[], // 当 type 为 team 时可见的团队列表
  }
})

// 难度选项
const difficultyOptions = ['入门', '简单', '中等', '困难']
const typeOptions = ['公开赛', '私密赛']
// 扩展时长选项，支持更长时间
const durationOptions = [
  { value: '1', label: '1小时' },
  { value: '2', label: '2小时' },
  { value: '3', label: '3小时' },
  { value: '4', label: '4小时' },
  { value: '5', label: '5小时' },
  { value: '24', label: '1天' },
  { value: '48', label: '2天' },
  { value: '72', label: '3天' },
  { value: '168', label: '1周' }
]
const visibilityOptions = [
  { value: 'public', label: '公开可见', icon: 'fluent:globe-20-filled' },
  { value: 'team', label: '团队可见', icon: 'fluent:people-team-20-filled' },
  { value: 'private', label: '私有', icon: 'fluent:lock-closed-20-filled' }
]

const availableTeams = ref([
  { id: 1, name: '算法竞赛团队' },
  { id: 2, name: '程序设计俱乐部' },
  { id: 3, name: '新生训练营' }
])

// 添加可选题目列表
const availableProblems = ref([
  { id: 1001, title: '两数之和', difficulty: '入门' },
  { id: 1002, title: '链表反转', difficulty: '简单' },
  { id: 1003, title: '二叉树遍历', difficulty: '中等' },
  { id: 1004, title: '最短路径', difficulty: '困难' },
  { id: 1005, title: '动态规划基础', difficulty: '中等' },
])

// 生成显示题号（A, B, C, D...）
const generateDisplayId = (index: number) => {
  return String.fromCharCode(65 + index) // 65 是字母 'A' 的 ASCII 码
}

// 添加题目
const addProblem = () => {
  contestForm.value.problems.push({
    problemId: null,
    displayId: generateDisplayId(contestForm.value.problems.length),
    title: '',
    difficulty: '入门',
    score: 100
  })
}

// 选择题目
const selectProblem = (index: number, problem: { id: number, title: string, difficulty: string }) => {
  contestForm.value.problems[index] = {
    ...contestForm.value.problems[index],
    problemId: problem.id,
    title: problem.title,
    difficulty: problem.difficulty
  }
}

// 删除题目
const removeProblem = (index: number) => {
  contestForm.value.problems.splice(index, 1)
}

// 添加规则
const addRule = () => {
  contestForm.value.rules.push('')
}

// 删除规则
const removeRule = (index: number) => {
  contestForm.value.rules.splice(index, 1)
}

// 添加团队
const addTeam = (teamId: number) => {
  if (!contestForm.value.visibility.teams.includes(teamId)) {
    contestForm.value.visibility.teams.push(teamId)
  }
}

// 移除团队
const removeTeam = (teamId: number) => {
  const index = contestForm.value.visibility.teams.indexOf(teamId)
  if (index > -1) {
    contestForm.value.visibility.teams.splice(index, 1)
  }
}

// 获取难度对应的颜色类名
const getDifficultyColor = (difficulty: string) => {
  const colors = {
    '入门': 'text-green-500',
    '简单': 'text-blue-500',
    '中等': 'text-yellow-500',
    '困难': 'text-red-500'
  }
  return colors[difficulty as keyof typeof colors] || 'text-gray-500'
}

// 计算比赛时长
const calculateDuration = () => {
  if (contestForm.value.startTime && contestForm.value.endTime) {
    const start = new Date(contestForm.value.startTime)
    const end = new Date(contestForm.value.endTime)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    contestForm.value.duration = hours.toString()
  }
}

// 根据开始时间和时长计算结束时间
const calculateEndTime = () => {
  if (contestForm.value.startTime && contestForm.value.duration) {
    const start = new Date(contestForm.value.startTime)
    const end = new Date(start.getTime() + parseInt(contestForm.value.duration) * 60 * 60 * 1000)
    contestForm.value.endTime = end.toISOString().slice(0, 16) // 格式化为 yyyy-MM-ddThh:mm
  }
}

// 监听开始时间和结束时间变化
const handleStartTimeChange = () => {
  if (contestForm.value.endTime) {
    calculateDuration()
  } else if (contestForm.value.duration) {
    calculateEndTime()
  }
}

const handleEndTimeChange = () => {
  calculateDuration()
}

// 处理时长选择
const handleDurationSelect = (hours: string) => {
  contestForm.value.duration = hours
  if (contestForm.value.startTime) {
    calculateEndTime()
  }
}

// 提交表单
const handleSubmit = async () => {
  // TODO: 实现提交逻辑
  console.log('提交的比赛数据：', contestForm.value)
  router.push('/contests')
}

// 添加搜索相关的状态
const searchDialog = ref<Dialog | null>(null)
const searchKeyword = ref('')
const selectedProblemIndex = ref(-1)

// 过滤后的问题列表
const filteredProblems = computed(() => {
  if (!searchKeyword.value) return availableProblems.value

  return availableProblems.value.filter(problem =>
    problem.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    problem.id.toString().includes(searchKeyword.value)
  )
})

// 显示搜索对话框
const showSearchDialog = (index: number) => {
  selectedProblemIndex.value = index
  searchKeyword.value = ''
  searchDialog.value?.show()
}

// 关闭搜索对话框
const closeSearchDialog = () => {
  searchDialog.value?.hide()
  searchKeyword.value = ''
}

// 应用搜索选择
const applyProblemSelection = (problem: { id: number, title: string, difficulty: string }) => {
  if (selectedProblemIndex.value >= 0) {
    selectProblem(selectedProblemIndex.value, problem)
  }
  closeSearchDialog()
}
</script>

<template>
  <div class="min-h-screen bg-neutral-100 dark:bg-neutral-900">
    <div class="container mx-auto px-4 py-6">
      <!-- 创建比赛表单 -->
      <div class="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold">创建新比赛</h1>
          <button @click="handleSubmit"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg 
                         transition-colors duration-200 flex items-center gap-2">
            <Icon icon="fluent:save-20-filled" class="w-5 h-5" />
            保存比赛
          </button>
        </div>

        <!-- 基本信息 -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium">比赛标题</label>
              <input v-model="contestForm.title"
                     type="text"
                     class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600" 
                     placeholder="输入比赛标题" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium">开始时间</label>
              <input v-model="contestForm.startTime"
                     type="datetime-local"
                     @change="handleStartTimeChange"
                     class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium">结束时间</label>
              <input v-model="contestForm.endTime"
                     type="datetime-local"
                     @change="handleEndTimeChange"
                     class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium">比赛时长</label>
              <fluent-menu>
                <fluent-button slot="trigger" 
                              appearance="outline"
                              class="w-full justify-between">
                  <span>{{ contestForm.duration }}小时</span>
                  <Icon icon="fluent:chevron-down-20-filled" class="w-4 h-4"/>
                </fluent-button>
                <fluent-menu-list>
                  <fluent-menu-item v-for="option in durationOptions" 
                                  :key="option.value"
                                  @click="handleDurationSelect(option.value)">
                    {{ option.label }}
                  </fluent-menu-item>
                </fluent-menu-list>
              </fluent-menu>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium">比赛时长（小时）</label>
              <select v-model="contestForm.duration"
                      class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600">
                <option v-for="option in durationOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium">比赛类型</label>
              <select v-model="contestForm.type"
                      class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600">
                <option v-for="option in typeOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium">难度等级</label>
              <select v-model="contestForm.difficulty"
                      class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600">
                <option v-for="option in difficultyOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium">比赛描述</label>
            <textarea v-model="contestForm.description"
                      rows="4"
                      class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600"
                      placeholder="输入比赛描述"></textarea>
          </div>

          <!-- 可见性设置 -->
          <div class="space-y-4">
            <label class="block text-lg font-medium">可见性设置</label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="option in visibilityOptions" 
                   :key="option.value"
                   @click="contestForm.visibility.type = option.value"
                   :class="[
                     'cursor-pointer p-4 rounded-lg border transition-colors duration-200',
                     contestForm.visibility.type === option.value
                       ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                       : 'border-neutral-200 dark:border-neutral-700'
                   ]">
                <div class="flex items-center gap-3">
                  <Icon :icon="option.icon" 
                        class="w-5 h-5"
                        :class="contestForm.visibility.type === option.value
                                ? 'text-blue-500'
                                : 'text-neutral-500'" />
                  <span :class="contestForm.visibility.type === option.value
                                ? 'text-blue-500'
                                : 'text-neutral-700 dark:text-neutral-300'">
                    {{ option.label }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 团队选择 -->
            <div v-if="contestForm.visibility.type === 'team'" class="space-y-4">
              <label class="block text-sm font-medium">选择可见团队</label>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="team in availableTeams" 
                     :key="team.id"
                     @click="contestForm.visibility.teams.includes(team.id) 
                              ? removeTeam(team.id) 
                              : addTeam(team.id)"
                     :class="[
                       'cursor-pointer p-3 rounded-lg border flex items-center justify-between',
                       contestForm.visibility.teams.includes(team.id)
                         ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                         : 'border-neutral-200 dark:border-neutral-700'
                     ]">
                  <span>{{ team.name }}</span>
                  <Icon :icon="contestForm.visibility.teams.includes(team.id)
                              ? 'fluent:checkmark-circle-20-filled'
                              : 'fluent:add-circle-20-regular'"
                        class="w-5 h-5"
                        :class="contestForm.visibility.teams.includes(team.id)
                                ? 'text-blue-500'
                                : 'text-neutral-500'" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- 比赛规则 -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium">比赛规则</h2>
            <button @click="addRule"
                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              <Icon icon="fluent:add-20-filled" class="w-5 h-5" />
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="(rule, index) in contestForm.rules" 
                 :key="index"
                 class="flex items-center gap-2">
              <input v-model="contestForm.rules[index]"
                     type="text"
                     class="flex-1 px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600"
                     placeholder="输入规则内容" />
              <button @click="removeRule(index)"
                      class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                <Icon icon="fluent:delete-20-filled" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- 题目列表 -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium">题目列表</h2>
            <button @click="addProblem"
                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              <Icon icon="fluent:add-20-filled" class="w-5 h-5" />
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="(problem, index) in contestForm.problems"
                 :key="index"
                 class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
              <!-- 显示题号 -->
              <div class="md:col-span-1 flex items-center justify-center">
                <span class="text-xl font-bold">{{ problem.displayId }}</span>
              </div>
              
              <!-- 题目选择 -->
              <div class="md:col-span-7 space-y-2">
                <label class="block text-sm font-medium">选择题目</label>
                <fluent-button 
                  appearance="secondary"
                  class="w-full text-left"
                  @click="showSearchDialog(index)"
                >
                  <div class="flex items-center justify-between">
                    <span v-if="problem.problemId">
                      {{ problem.problemId }} - {{ problem.title }}
                    </span>
                    <span v-else class="text-neutral-500">
                      点击选择题目...
                    </span>
                    <Icon icon="fluent:search-20-regular" class="w-5 h-5" />
                  </div>
                </fluent-button>
              </div>

              <!-- 分数设置 -->
              <div class="md:col-span-3 flex items-center gap-4">
                <div class="space-y-2 flex-1">
                  <label class="block text-sm font-medium">分数</label>
                  <input v-model="problem.score"
                         type="number"
                         class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600"
                         placeholder="100" />
                </div>
              </div>

              <!-- 删除按钮 -->
              <div class="md:col-span-1 flex items-center justify-center">
                <button @click="removeProblem(index)"
                        class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  <Icon icon="fluent:delete-20-filled" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加搜索对话框 -->
    <fluent-dialog ref="searchDialog">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">搜索题目</h3>
          <fluent-button appearance="lightweight" @click="closeSearchDialog">
            <Icon icon="fluent:dismiss-20-regular" class="w-5 h-5" />
          </fluent-button>
        </div>
        <fluent-text-input 
          v-model="searchKeyword" 
          placeholder="输入题目编号或标题" 
          class="min-w-[97%] mb-4" 
        />
        
        <!-- 搜索结果列表 -->
        <div class="max-h-[50vh] overflow-y-auto mb-4">
          <div v-for="problem in filteredProblems" 
               :key="problem.id"
               @click="applyProblemSelection(problem)"
               class="flex items-center justify-between p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer">
            <span>{{ problem.id }} - {{ problem.title }}</span>
            <span :class="getDifficultyColor(problem.difficulty)">
              {{ problem.difficulty }}
            </span>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <fluent-button appearance="secondary" @click="closeSearchDialog">取消</fluent-button>
        </div>
      </div>
    </fluent-dialog>
  </div>
</template>

<style scoped>
input[type="datetime-local"] {
  color-scheme: light dark;
}

/* 添加对话框样式 */
fluent-dialog {
  --dialog-width: 600px;
  --dialog-height: auto;
}
</style>
