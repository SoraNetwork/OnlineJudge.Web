<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import StatusTokenItem from '@/components/StatusTokenItem.vue'
import { getSubmissions, getSubmissionDetail } from '@/api/questionApi'
import type { SubmissionRecord } from '@/api/questionApi'
import { message } from '@/services/MessageService'

// 类型定义
interface StatusOption {
  value: string;
  label: string;
  icon?: string;
}

interface LanguageOption {
  value: string;
  label: string;
  icon: string;
}

interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  username: string;
  status: string;
  language: string;
  timeUsed: string;
  memoryUsed: string;
  submitTime: string;
  code: string;
}

interface Filters {
  status: string;
  language: string;
  username: string;
  problemId: string;
}

interface Pagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

// 状态选项 - 更新为实际 API 使用的值（没有空格的状态名称）
const statusOptions = ref<StatusOption[]>([
  { value: '', label: '全部' },
  { value: 'Accepted', label: 'Accepted', icon: 'fluent:checkmark-20-filled' },
  { value: 'WrongAnswer', label: 'Wrong Answer', icon: 'fluent:dismiss-20-filled' },
  { value: 'TimeLimitExceeded', label: 'Time Limit Exceeded', icon: 'fluent:timer-20-filled' },
  { value: 'MemoryLimitExceeded', label: 'Memory Limit Exceeded', icon: 'fluent:warning-20-filled' },
  { value: 'RuntimeError', label: 'Runtime Error', icon: 'fluent:error-circle-20-filled' },
  { value: 'CompilationError', label: 'Compile Error', icon: 'fluent:code-20-filled' },
  { value: 'Pending', label: '等待中', icon: 'fluent:clock-20-filled' },
  { value: 'Running', label: '运行中', icon: 'fluent:arrow-sync-20-filled' },
])

// 语言选项 - 更新为实际支持的语言
const languageOptions = ref<LanguageOption[]>([
  { value: '', label: '全部', icon: 'fluent:question-circle-20-filled' },
  { value: 'cpp', label: 'C++', icon: 'vscode-icons:file-type-cpp3' },
  { value: 'python', label: 'Python', icon: 'vscode-icons:file-type-python' },
  { value: 'java', label: 'Java', icon: 'vscode-icons:file-type-java' },
  { value: 'javascript', label: 'JavaScript', icon: 'vscode-icons:file-type-js-official' },
  { value: 'csharp', label: 'C#', icon: 'vscode-icons:file-type-csharp2' },
])

// 查询条件
const filters = ref<Filters>({
  status: '',
  language: '',
  username: '',
  problemId: ''
})

// 评测记录数据
const submissions = ref<SubmissionRecord[]>([])

// 分页数据
const pagination = ref<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 加载状态
const isLoading = ref(false)
const isSubmissionDetailLoading = ref(false)

// 代码查看对话框
const isCodeDialogOpen = ref(false)
import type { Ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const selectedSubmission = ref<any>(null)

// 查看提交详情
const showCode = async (submission: SubmissionRecord): Promise<void> => {
  router.push(`/questions/status/detail/${submission.id}`)
}

// 加载提交记录数据
const loadSubmissions = async () => {
  try {
    isLoading.value = true
    
    const params = {
      questionId: filters.value.problemId || undefined,
      status: filters.value.status || undefined,
      languageCode: filters.value.language || undefined,
      userName: filters.value.username || undefined,
      getAllUsers: true,
      pageIndex: pagination.value.currentPage,
      pageSize: pagination.value.pageSize
    }
    
    const response = await getSubmissions(params)
    
    if (response.success && response.data) {
      submissions.value = response.data
      
      // 如果API返回的是分页数据，更新分页信息
      if ('totalCount' in response.data) {
        pagination.value.total = Number(response.data.totalCount) || 0
      } else {
        // 如果API不返回总数，使用当前列表长度
        pagination.value.total = submissions.value.length
      }
    } else {
      message.error('获取提交记录失败')
      submissions.value = []
    }
  } catch (error) {
    console.error('加载提交记录失败:', error)
    message.error('加载提交记录失败，请稍后重试')
    submissions.value = []
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page: number): void => {
  pagination.value.currentPage = page
  loadSubmissions()
}

const handleSearch = (): void => {
  pagination.value.currentPage = 1 // 搜索时重置到第一页
  loadSubmissions()
}

// 监听筛选条件变化
watch(
  () => filters.value,
  (newVal, oldVal) => {
    // 可以选择在这里自动搜索，或者仅当点击搜索按钮时才搜索
    // handleSearch()
  },
  { deep: true }
)

const getLanguageIcon = (language: string): string => {
  const option = languageOptions.value.find(opt => opt.label === language)
  return option?.icon || 'fluent:code-20-filled'
}

const getSelectedStatusOption = computed(() => {
  return statusOptions.value.find(opt => opt.value === filters.value.status) || statusOptions.value[0]
})

const isMobile = ref(window.innerWidth < 768)

// 监听窗口大小变化
onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始加载数据
  loadSubmissions()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

const navigate = (path:string) => {
  window.scrollTo(0, 0);
  router.push(path);
}

// 格式化时间
const formatDateTime = (dateTimeStr: string) => {
  try {
    const date = new Date(dateTimeStr)
    return date.toLocaleString()
  } catch (e) {
    return dateTimeStr
  }
}

// 格式化内存显示
const formatMemory = (memoryInKB: number) => {
  if (memoryInKB < 1024) {
    return `${memoryInKB.toFixed(2)} B`
  } else {
    return `${(memoryInKB / 1024).toFixed(2)} KB`
  }
}

// 添加状态值映射函数，将显示用的状态名转换为 API 使用的状态值
const getStatusValue = (displayStatus: string): string => {
  // 移除空格，确保状态值格式正确
  return displayStatus.replace(/\s+/g, '')
}

// 修改提交代码视图中的状态显示
const formatStatusDisplay = (statusValue: string): string => {
  // 将无空格的API状态值转换为有空格的显示形式
  const option = statusOptions.value.find(opt => opt.value === statusValue)
  return option ? option.label : statusValue
}
</script>

<template>
  <div class="bg-white dark:bg-neutral-900">
    <div class="container mx-auto px-2 sm:px-4 py-6">
      <!-- 查询条件 -->
      <div class="mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <!-- 状态筛选 -->
          <fluent-menu class="w-full">
            <fluent-button slot="trigger" appearance="outline" class="w-full">
              <div class="flex items-center gap-2">
                <Icon :icon="getSelectedStatusOption.icon || 'fluent:question-circle-20-filled'" class="w-5 h-5"/>
                <p>{{ getSelectedStatusOption.label }}</p>
              </div>
            </fluent-button>
            <fluent-menu-list class="max-h-[300px] overflow-y-auto w-max min-w-[200px] z-50">
              <fluent-menu-item
                v-for="option in statusOptions"
                :key="option.value"
                @click="filters.status = option.value"
                class="px-3 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <div class="flex items-center gap-2">
                  <Icon :icon="option.icon || 'fluent:question-circle-20-filled'" class="w-5 h-5"/>
                  <p>{{ option.label }}</p>
                </div>
              </fluent-menu-item>
            </fluent-menu-list>
          </fluent-menu>

          <!-- 语言筛选 -->
          <fluent-menu class="w-full">
            <fluent-button slot="trigger" appearance="outline" class="w-full">
              <div class="flex items-center gap-2">
                <Icon :icon="languageOptions.find(opt => opt.value === filters.language)?.icon || 'fluent:question-circle-20-filled'" class="w-5 h-5"/>
                <p>{{ languageOptions.find(opt => opt.value === filters.language)?.label || '语言' }}</p>
              </div>
            </fluent-button>
            <fluent-menu-list class="max-h-[300px] overflow-y-auto w-max min-w-[200px] z-50">
              <fluent-menu-item
                v-for="option in languageOptions"
                :key="option.value"
                @click="filters.language = option.value"
                class="px-3 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <div class="flex items-center gap-2">
                  <Icon :icon="option.icon" class="w-5 h-5"/>
                  <p>{{ option.label }}</p>
                </div>
              </fluent-menu-item>
            </fluent-menu-list>
          </fluent-menu>

          <!-- 用户名搜索 -->
          <fluent-text-input
            v-model="filters.username"
            placeholder="用户名"
            appearance="outline"
            type="text"
            class="w-full"
          >
            <Icon icon="fluent:person-20-filled" slot="start" class="w-5 h-5"/>
          </fluent-text-input>

          <!-- 题目ID搜索 -->
          <fluent-text-input
            v-model="filters.problemId"
            placeholder="题目ID"
            class="w-full"
          >
            <Icon icon="fluent:document-20-filled" slot="start" class="w-5 h-5"/>
          </fluent-text-input>
        </div>

        <div class="mt-4 flex justify-end">
          <fluent-button appearance="accent" @click="handleSearch" :disabled="isLoading">
            <Icon v-if="isLoading" icon="fluent:spinner-ios-20-regular" class="w-5 h-5 mr-2 animate-spin"/>
            <Icon v-else icon="fluent:search-20-filled" class="w-5 h-5 mr-2"/>
            {{ isLoading ? '加载中...' : '搜索' }}
          </fluent-button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center my-12">
        <div class="flex flex-col items-center gap-4">
          <Icon icon="fluent:spinner-ios-20-regular" class="w-12 h-12 animate-spin text-blue-500"/>
          <p class="text-neutral-500">正在加载提交记录...</p>
        </div>
      </div>
      
      <!-- 无数据状态 -->
      <div v-else-if="submissions.length === 0" class="flex justify-center my-12">
        <div class="flex flex-col items-center gap-4">
          <Icon icon="fluent:document-20-regular" class="w-12 h-12 text-neutral-400"/>
          <p class="text-neutral-500">暂无提交记录</p>
        </div>
      </div>

      <!-- 评测记录列表 -->
      <div v-else-if="!isMobile" class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden">
        <!-- 桌面端表格布局 -->
        <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead class="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                题目
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                用户
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                语言
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                耗时/内存
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                提交时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            <tr v-for="submission in submissions" :key="submission.id">
              
              <td class="px-6 py-4 whitespace-nowrap">
                <a @click="navigate(`/questions/${submission.questionId}`)" class="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
                  {{ submission.questionId }}
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <StatusTokenItem :status="submission.status" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <a class="text-blue-600 dark:text-blue-400 hover:underline">
                  {{ submission.userName }}
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <Icon :icon="getLanguageIcon(submission.language)" class="w-5 h-5"/>
                  <span>{{ submission.language }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {{ submission.timeUsed }}ms <!--/ {{ formatMemory(submission.memoryUsed) }}-->
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {{ formatDateTime(submission.submitTime) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <fluent-button appearance="lightweight" @click="showCode(submission)">
                  <Icon icon="fluent:code-20-filled" class="w-5 h-5"/>
                </fluent-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 移动端卡片布局 -->
      <div v-else class="space-y-4">
        <div v-for="submission in submissions" 
             :key="submission.id"
             class="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <div class="space-y-2">
            <div class="flex justify-between items-start">
              <a @click="navigate(`/questions/${submission.questionId}`)" class="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
                {{ submission.questionId }}
              </a>
              <StatusTokenItem :status="submission.status" />
            </div>
            
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex items-center gap-1">
                <Icon icon="fluent:person-20-filled" class="w-4 h-4"/>
                <a class="text-blue-600 dark:text-blue-400">{{ submission.userName }}</a>
              </div>
              
              <div class="flex items-center gap-1">
                <Icon :icon="getLanguageIcon(submission.language)" class="w-4 h-4"/>
                <span>{{ submission.language }}</span>
              </div>

              <div class="text-neutral-500 dark:text-neutral-400">
                {{ submission.timeUsed }}ms / <!-- {{ formatMemory(submission.memoryUsed) }} -->
              </div>

              <div class="text-neutral-500 dark:text-neutral-400">
                {{ formatDateTime(submission.submitTime) }}
              </div>
            </div>

            <div class="flex justify-end">
              <fluent-button appearance="lightweight" @click="showCode(submission)">
                <Icon icon="fluent:code-20-filled" class="w-5 h-5"/>
                查看代码
              </fluent-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="submissions.length > 0" class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-sm text-neutral-500 dark:text-neutral-400">
          共 {{ pagination.total }} 条记录
        </div>
        <div class="flex gap-2">
          <fluent-button 
            appearance="outline"
            :disabled="pagination.currentPage === 1 || isLoading"
            @click="handlePageChange(pagination.currentPage - 1)"
          >
            上一页
          </fluent-button>
          <span class="px-4 py-2">
            第 {{ pagination.currentPage }} 页
          </span>
          <fluent-button 
            appearance="outline"
            :disabled="pagination.currentPage * pagination.pageSize >= pagination.total || isLoading"
            @click="handlePageChange(pagination.currentPage + 1)"
          >
            下一页
          </fluent-button>
        </div>
      </div>

      <!-- 代码查看对话框 -->
      <fluent-dialog 
        :open="isCodeDialogOpen"
        @close="isCodeDialogOpen = false"
        :class="isMobile ? 'w-[95vw] h-[90vh]' : 'w-3/4 h-3/4'"
      >
        <div class="p-4" v-if="selectedSubmission">
          <h2 class="text-xl font-bold mb-4">提交详情</h2>
          
          <!-- 加载状态 -->
          <div v-if="isSubmissionDetailLoading" class="flex justify-center my-8">
            <div class="flex flex-col items-center gap-4">
              <Icon icon="fluent:spinner-ios-20-regular" class="w-8 h-8 animate-spin text-blue-500"/>
              <p class="text-neutral-500">正在加载提交详情...</p>
            </div>
          </div>
          
          <template v-else>
            <div class="mb-4">
              <div class="grid grid-cols-2 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div>提交ID: {{ selectedSubmission.id }}</div>
                <div>题目: {{ selectedSubmission.problemId }}</div>
                <div>用户: {{ selectedSubmission.username }}</div>
                <div>语言: {{ selectedSubmission.language }}</div>
                <div>状态: {{ formatStatusDisplay(selectedSubmission.status) }}</div>
                <div>提交时间: {{ formatDateTime(selectedSubmission.submitTime) }}</div>
              </div>
            </div>
            
            <!-- 错误信息 -->
            <div v-if="selectedSubmission.message" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300">
              <div class="font-bold mb-1">错误信息:</div>
              <pre class="text-sm whitespace-pre-wrap">{{ selectedSubmission.message }}</pre>
            </div>
            
            <!-- 代码 -->
            <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800 overflow-auto max-h-[50vh]">
              <pre class="text-sm"><code>{{ selectedSubmission.code }}</code></pre>
            </div>
            
            <!-- 测试用例结果 -->
            <div v-if="selectedSubmission.testCaseResults && selectedSubmission.testCaseResults.length > 0" class="mt-6">
              <h3 class="text-lg font-bold mb-3">测试点结果</h3>
              <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead class="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400">#</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400">结果</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400">耗时</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400">内存</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400">分数</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                    <tr v-for="(result, index) in selectedSubmission.testCaseResults" :key="index">
                      <td class="px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">
                        <div class="flex items-center">
                          <Icon 
                            :icon="result.passed ? 'fluent:checkmark-circle-20-filled' : 'fluent:dismiss-circle-20-filled'" 
                            class="w-5 h-5 mr-1"
                            :class="result.passed ? 'text-green-500' : 'text-red-500'"
                          />
                          {{ result.passed ? '通过' : '失败' }}
                        </div>
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap">{{ result.timeUsed }}ms</td>
                    <!--  <td class="px-4 py-2 whitespace-nowrap">{{ formatMemory(result.memoryUsed) }}</td> -->
                      <td class="px-4 py-2 whitespace-nowrap">{{ result.score }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
      </fluent-dialog>
    </div>
  </div>
</template>

<style scoped>
/* 只保留必要的 Fluent UI 变量设置 */
:deep(fluent-menu) {
  --background-color: var(--neutral-layer-1);
  --border-color: var(--neutral-stroke-rest);
}

:deep(fluent-text-input) {
  width: 100%;
  --design-unit: 0;
}

@media (max-width: 768px) {
  :deep(fluent-menu-list) {
    width: calc(100vw - 2rem) !important;
    max-width: none !important;
  }
}
</style>
