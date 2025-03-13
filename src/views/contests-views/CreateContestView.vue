<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import TokenItem from '@/components/TokenItem.vue'
import { Dialog } from '@fluentui/web-components'
import { createContest, type CreateContestRequest } from '@/api/contestApi'
import { getQuestions, type Question, type GetQuestionsParams } from '@/api/questionApi'
import { message } from '@/services/MessageService' // 导入消息服务

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
      problemId: null as string | null, // 实际题目ID
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
  { value: 'private', label: '私有', icon: 'fluent:lock-closed-20-filled' }
]


// 替换静态题目为API获取的题目列表
const availableProblems = ref<Question[]>([])
const isLoadingProblems = ref(false)
const loadingError = ref<string | null>(null)
const totalProblemCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取题目列表
const fetchProblems = async (page = 1, search = '') => {
  isLoadingProblems.value = true
  loadingError.value = null
  
  try {
    const params: GetQuestionsParams = {
      pageIndex: page - 1, // API使用0基索引
      pageSize: pageSize.value,
    }
    
    if (search) {
      params.searchTitle = search
    }
    
    const response = await getQuestions(params)
    
    if (response.success && response.data) {
      availableProblems.value = response.data.items
      totalProblemCount.value = response.data.totalCount
      currentPage.value = page
    } else {
      loadingError.value = response.message || '获取题目列表失败'
    }
  } catch (error) {
    console.error('获取题目失败:', error)
    loadingError.value = '网络错误，请稍后重试'
  } finally {
    isLoadingProblems.value = false
  }
}

// 初始加载题目
onMounted(() => {
  fetchProblems()
})

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
const selectProblem = (index: number, problem: Question) => {
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
    // 计算小时差，并向上取整到最接近的整数
    const hoursDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60))
    
    // 检查是否为预定义的时长选项
    const predefinedOption = durationOptions.find(option => parseInt(option.value) === hoursDiff)
    contestForm.value.duration = predefinedOption ? predefinedOption.value : hoursDiff.toString()
  }
}

// 根据开始时间和时长计算结束时间
const calculateEndTime = () => {
  if (contestForm.value.startTime && contestForm.value.duration) {
    const start = new Date(contestForm.value.startTime)
    const durationHours = parseInt(contestForm.value.duration)
    
    // 确保durationHours是有效数字
    if (!isNaN(durationHours)) {
      const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000)
      // 格式化为 yyyy-MM-ddThh:mm
      const year = end.getFullYear()
      const month = String(end.getMonth() + 1).padStart(2, '0')
      const day = String(end.getDate()).padStart(2, '0')
      const hours = String(end.getHours()).padStart(2, '0')
      const minutes = String(end.getMinutes()).padStart(2, '0')
      
      contestForm.value.endTime = `${year}-${month}-${day}T${hours}:${minutes}`
    }
  }
}

// 监听开始时间和结束时间变化
const handleStartTimeChange = () => {
  if (contestForm.value.startTime) {
    if (contestForm.value.endTime) {
      calculateDuration() // 如果结束时间存在，重新计算时长
    } else if (contestForm.value.duration) {
      calculateEndTime() // 如果时长存在，计算结束时间
    }
  }
}

const handleEndTimeChange = () => {
  if (contestForm.value.endTime && contestForm.value.startTime) {
    calculateDuration() // 当结束时间变化时，重新计算时长
  }
}

// 处理时长选择
const handleDurationSelect = (hours: string) => {
  contestForm.value.duration = hours
  if (contestForm.value.startTime) {
    calculateEndTime() // 当时长变化时，重新计算结束时间
  }
}

// 添加创建状态控制
const isSubmitting = ref(false)
// 移除局部错误状态，改用全局消息
// const submitError = ref<string | null>(null)
// const submitSuccess = ref(false)

// 提交表单
const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  // 验证表单
  if (!contestForm.value.title) {
    message.error('请输入比赛标题')
    return
  }
  
  if (!contestForm.value.startTime) {
    message.error('请选择开始时间')
    return
  }
  
  if (!contestForm.value.endTime) {
    message.error('请选择结束时间')
    return
  }
  
  // 检查是否所有题目都已选择
  const hasInvalidProblem = contestForm.value.problems.some(p => !p.problemId)
  if (hasInvalidProblem) {
    message.error('请为所有题目选择题目')
    return
  }
  
  isSubmitting.value = true
  
  try {
    // 准备请求数据
    const requestData: CreateContestRequest = {
      title: contestForm.value.title,
      description: contestForm.value.description,
      startTime: new Date(contestForm.value.startTime).toISOString(),
      endTime: new Date(contestForm.value.endTime).toISOString(),
      duration: contestForm.value.duration,
      type: contestForm.value.type,
      difficulty: contestForm.value.difficulty,
      rules: contestForm.value.rules.filter(rule => rule.trim() !== ''), // 过滤空规则
      problems: contestForm.value.problems.map(p => ({
        problemId: p.problemId?.toString() || '',
        displayId: p.displayId,
        score: p.score
      })),
      visibility: {
        type: contestForm.value.visibility.type,
        teams: contestForm.value.visibility.teams
      }
    }
    
    const response = await createContest(requestData)
    
    if (response.success) {
      message.success('比赛创建成功')
      // 延迟跳转
      setTimeout(() => {
        router.push('/contests')
      }, 1500)
    } else {
      message.error(response.message || '创建比赛失败，请稍后再试')
    }
  } catch (err) {
    console.error('创建比赛时出错:', err)
    message.error('创建比赛时出错')
  } finally {
    isSubmitting.value = false
  }
}

// 添加搜索相关的状态
const searchDialog = ref<Dialog | null>(null)
const searchKeyword = ref('')
const selectedProblemIndex = ref(-1)

// 修改过滤函数，直接使用API搜索
const handleSearchInputChange = () => {
  // 延迟执行搜索，减少API调用
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchProblems(1, searchKeyword.value)
  }, 500)
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null

// 显示搜索对话框
const showSearchDialog = (index: number) => {
  selectedProblemIndex.value = index
  searchKeyword.value = ''
  currentPage.value = 1
  fetchProblems(1, '') // 重新加载第一页数据
  searchDialog.value?.show()
}

// 关闭搜索对话框
const closeSearchDialog = () => {
  searchDialog.value?.hide()
  searchKeyword.value = ''
}

// 加载更多题目
const loadMoreProblems = () => {
  if (availableProblems.value.length < totalProblemCount.value) {
    fetchProblems(currentPage.value + 1, searchKeyword.value)
  }
}

// 应用搜索选择
const applyProblemSelection = (problem: Question) => {
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
                  :disabled="isSubmitting"
                  class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 
                         text-white px-4 py-2 rounded-lg transition-colors duration-200 
                         flex items-center gap-2">
            <div v-if="isSubmitting" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <Icon v-else icon="fluent:save-20-filled" class="w-5 h-5" />
            {{ isSubmitting ? '保存中...' : '保存比赛' }}
          </button>
        </div>
        
        <!-- 移除本地错误和成功提示 -->
        
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
                  <span>{{ 
                  durationOptions.find(opt => opt.value === contestForm.duration)?.label || 
                  `${contestForm.duration}小时` 
                  }}</span>
                  <Icon icon="fluent:chevron-down-20-filled" class="w-4 h-4"/>
                </fluent-button>
                <fluent-menu-list class="max-h-60 overflow-y-auto">
                  <fluent-menu-item 
                  v-for="option in durationOptions" 
                  :key="option.value"
                  @click="handleDurationSelect(option.value)"
                  class="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  :class="{'bg-blue-50 dark:bg-blue-900/20': contestForm.duration === option.value}"
                  >
                  <div class="flex items-center justify-between w-full">
                    <span>{{ option.label }}</span>
                    <Icon 
                    v-if="contestForm.duration === option.value"
                    icon="fluent:checkmark-16-filled" 
                    class="w-4 h-4 text-blue-500" 
                    />
                  </div>
                  </fluent-menu-item>
                </fluent-menu-list>
                </fluent-menu>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!--- <div class="space-y-2">
              <label class="block text-sm font-medium">比赛时长（小时）</label>
              <select v-model="contestForm.duration"
                      class="w-full px-3 py-2 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600">
                <option v-for="option in durationOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div> -->
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
            <!--
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
            </div>-->

          </div>
        </div>

        <!-- 比赛规则 -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium">比赛规则</h2>
            <button @click="addRule"
                    class="cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
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
                      class="cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
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
                    class="cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
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
                <button  @click="removeProblem(index)"
                        class="cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
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
        
        <div class="relative mb-4">
          <fluent-text-input 
            v-model="searchKeyword" 
            placeholder="输入题目编号或标题" 
            class="min-w-[97%]"
            @input="handleSearchInputChange"
          />
          <div v-if="isLoadingProblems" class="absolute right-3 top-2">
            <div class="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
        
        <!-- 修改加载错误显示为使用全局消息 -->
        
        <!-- 搜索结果列表 -->
        <div class="max-h-[50vh] overflow-y-auto mb-4">
          <div v-if="availableProblems.length === 0 && !isLoadingProblems" class="text-center py-4 text-gray-500">
            未找到匹配的题目
          </div>
          
          <div v-for="problem in availableProblems" 
               :key="problem.id"
               @click="applyProblemSelection(problem)"
               class="flex items-center justify-between p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer">
            <div class="flex flex-col">
              <span class="font-medium">{{ problem.id }} - {{ problem.title }}</span>
              <span class="text-sm text-gray-500">{{ problem.tags.join(', ') }}</span>
            </div>
            <span :class="getDifficultyColor(problem.difficulty)">
              {{ problem.difficulty }}
            </span>
          </div>
          
          <!-- 加载更多按钮 -->
          <div v-if="availableProblems.length < totalProblemCount" class="text-center py-2">
            <fluent-button 
              appearance="lightweight" 
              @click="loadMoreProblems"
              :disabled="isLoadingProblems"
            >
              {{ isLoadingProblems ? '加载中...' : '加载更多' }}
            </fluent-button>
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
