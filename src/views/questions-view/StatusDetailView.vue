<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import TokenItem from '@/components/TokenItem.vue'
import * as monaco from 'monaco-editor'
import { getSubmissionDetail, type SubmissionDetail, type TestCaseResult } from '@/api/questionApi'

const route = useRoute()
const router = useRouter()
const submissionId = route.params.id as string

interface TestCase {
  id: number
  status: string
  time: string
  memory: string
  input?: string
  output?: string
  expected?: string
  message?: string
  score?: number // 添加分数字段
}

interface SubmissionViewModel {
  id: string
  problemId: string
  problemTitle: string
  username: string
  status: string
  language: string
  time: string
  memory: string
  submitTime: string
  code: string
  testCases: TestCase[]
  compileError?: string
  score: number // 添加总分数字段
}

const isLoading = ref(true)
const error = ref<string | null>(null)
const submission = ref<SubmissionViewModel | null>(null)

const editorInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(null)
const editorContainer = ref<HTMLElement | null>(null)

// 获取状态图标
const getStatusIcon = (status: string): string => {
  const iconMap: Record<string, string> = {
    'Accepted': 'fluent:checkmark-20-filled',
    'WrongAnswer': 'fluent:dismiss-20-filled',
    'Wrong Answer': 'fluent:dismiss-20-filled',
    'TimeLimitExceeded': 'fluent:timer-20-filled',
    'MemoryLimitExceeded': 'fluent:warning-20-filled',
    'RuntimeError': 'fluent:error-circle-20-filled',
    'CompilationError': 'fluent:code-20-filled',
    'Time Limit Exceeded': 'fluent:timer-20-filled',
    'Memory Limit Exceeded': 'fluent:warning-20-filled',
    'Runtime Error': 'fluent:error-circle-20-filled',
    'Compilation Error': 'fluent:code-20-filled'
  }
  return iconMap[status] || 'fluent:question-circle-20-filled'
}

// 获取语言图标
const getLanguageIcon = (language: string): string => {
  const iconMap: Record<string, string> = {
    'C++': 'vscode-icons:file-type-cpp3',
    'Python': 'vscode-icons:file-type-python',
    'Java': 'vscode-icons:file-type-java',
    'JavaScript': 'vscode-icons:file-type-js-official'
  }
  return iconMap[language] || 'fluent:code-20-filled'
}

// 返回列表
const handleBack = () => {
  router.back()
}

// 格式化时间和内存
const formatTimeUsed = (timeUsed: number): string => {
  return `${timeUsed} ms`
}

const formatMemoryUsed = (memoryUsed: number): string => {
  return `${(memoryUsed / 1024).toFixed(0)} KB`
}

// 将API返回的提交记录转换为视图模型
const convertToViewModel = (detail: SubmissionDetail): SubmissionViewModel => {
  const testCases: TestCase[] = detail.testCaseResults.map((result, index) => ({
    id: index + 1,
    status: result.passed ? 'Accepted' : 'Wrong Answer',
    time: formatTimeUsed(result.timeUsed),
    memory: formatMemoryUsed(result.memoryUsed),
    input: result.input,
    output: result.actualOutput,
    expected: result.expectedOutput,
    score: result.score // 添加测试点分数
  }))

  return {
    id: detail.id,
    problemId: detail.questionId,
    problemTitle: '', // 这个需要从题目获取，API中没有返回
    username: detail.userName,
    status: detail.status,
    language: detail.language,
    time: formatTimeUsed(detail.timeUsed),
    memory: formatMemoryUsed(detail.memoryUsed),
    submitTime: detail.submitTime,
    code: detail.code,
    testCases: testCases,
    compileError: detail.message || undefined,
    score: detail.score // 添加总分数
  }
}

// 获取分数的样式类，0分显示为红色
const getScoreClass = (score: number | undefined): string => {
  if (score === undefined) return '';
  return score === 0 ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium';
}

// 检查状态是否为 Pending
const isPending = (status: string): boolean => {
  return status === 'Pending';
}

// 获取提交记录详情
const fetchSubmissionDetail = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await getSubmissionDetail(submissionId)
    if (response.success && response.data) {
      submission.value = convertToViewModel(response.data)
    } else {
      error.value = response.message || '获取提交记录失败'
    }
  } catch (err) {
    console.error('获取提交记录详情出错:', err)
    error.value = '系统错误，请稍后再试'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchSubmissionDetail()

  // 初始化代码编辑器
  if (editorContainer.value && submission.value) {
    editorInstance.value = monaco.editor.create(editorContainer.value, {
      value: submission.value.code,
      language: submission.value.language.toLowerCase(),
      theme: 'vs-dark',
      readOnly: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      tabSize: 4,
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      padding: { top: 16, bottom: 16 },
    })
  }
})
</script>

<template>
  <div class="bg-white dark:bg-neutral-900">
    <div class="container mx-auto px-4 py-6">
      <!-- 返回按钮和标题 -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <fluent-button appearance="stealth" class="p-1 min-w-0" @click="handleBack">
            <Icon icon="fluent:arrow-left-20-filled" class="w-5 h-5" />
          </fluent-button>
          <h1 class="text-xl font-bold">提交记录 #{{ submissionId }}</h1>
        </div>
      </div>

      <!-- 加载中状态 -->
      <div v-if="isLoading" class="flex justify-center items-center py-16">
        <fluent-progress-ring></fluent-progress-ring>
      </div>

      <!-- 错误信息 -->
      <div v-else-if="error" class="text-center py-16">
        <div class="text-red-500 mb-2">{{ error }}</div>
        <fluent-button appearance="accent" @click="fetchSubmissionDetail">重新加载</fluent-button>
      </div>

      <!-- 提交信息卡片 -->
      <div v-else-if="submission" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <!-- 代码区域 -->
          <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden mb-6">
            <div class="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon :icon="getLanguageIcon(submission.language)" class="w-5 h-5" />
                <span>{{ submission.language }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span v-if="!isPending(submission.status)" :class="getScoreClass(submission.score)">得分 {{
                  submission.score }}</span>
                <TokenItem :Token="submission.status" :Glyph="getStatusIcon(submission.status)" />
              </div>
            </div>
            <div ref="editorContainer" class="h-[400px]"></div>
          </div>

          <!-- 编译错误信息 -->
          <div v-if="submission.compileError"
            class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden mb-6">
            <div class="bg-neutral-100 dark:bg-neutral-800 px-4 py-3">
              <h2 class="font-semibold text-red-500">错误</h2>
            </div>
            <div class="p-4">
              <pre
                class="bg-neutral-50 dark:bg-neutral-800 p-3 rounded text-sm overflow-x-auto text-red-500">{{ submission.compileError }}</pre>
            </div>
          </div>

          <!-- 测试点详情 -->
          <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden">
            <div class="bg-neutral-100 dark:bg-neutral-800 px-4 py-3">
              <h2 class="font-semibold">测试点信息</h2>
            </div>
            <div class="divide-y divide-neutral-200 dark:divide-neutral-700">
              <div v-for="testCase in submission.testCases" :key="testCase.id" class="p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <span class="font-medium">测试点 #{{ testCase.id }}</span>
                    <TokenItem :Token="testCase.status" :Glyph="getStatusIcon(testCase.status)" />
                  </div>
                  <div class="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-4">
                    <span v-if="!isPending(testCase.status)" :class="getScoreClass(testCase.score)">得分  {{
                      testCase.score }}</span>
                    <span>耗时: {{ testCase.time }}</span>
                    <!--<span>内存: {{ testCase.memory }}</span> -->
                  </div>
                </div>
                <div v-if="testCase.status !== 'Accepted'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="testCase.input" class="space-y-2">
                    <div class="font-medium text-sm">输入：</div>
                    <pre
                      class="bg-neutral-50 dark:bg-neutral-800 p-2 rounded text-sm overflow-x-auto">{{ testCase.input }}</pre>
                  </div>
                  <div v-if="testCase.output" class="space-y-2">
                    <div class="font-medium text-sm">输出：</div>
                    <pre
                      class="bg-neutral-50 dark:bg-neutral-800 p-2 rounded text-sm overflow-x-auto">{{ testCase.output }}</pre>
                  </div>
                  <div v-if="testCase.expected" class="space-y-2">
                    <div class="font-medium text-sm">期望输出：</div>
                    <pre
                      class="bg-neutral-50 dark:bg-neutral-800 p-2 rounded text-sm overflow-x-auto">{{ testCase.expected }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交信息侧边栏 -->
        <div class="lg:col-span-1">
          <div
            class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-6">
            <h2 class="text-lg font-semibold mb-4">提交信息</h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">提交ID</span>
                <span>{{ submission.id }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">题目</span>
                <a class="text-blue-600 dark:text-blue-400 hover:underline"
                  :href="`/questions/${submission.problemId}`">
                  {{ submission.problemId }}
                </a>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">用户</span>
                <a class="text-blue-600 dark:text-blue-400 hover:underline" :href="`/profile/${submission.username}`">
                  {{ submission.username }}
                </a>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">状态</span>
                <TokenItem :Token="submission.status" :Glyph="getStatusIcon(submission.status)" />
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">得分</span>
                <span v-if="!isPending(submission.status)" :class="getScoreClass(submission.score)">{{ submission.score
                  }}</span>
                <span v-else class="text-blue-500">评测中</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">语言</span>
                <div class="flex items-center gap-2">
                  <Icon :icon="getLanguageIcon(submission.language)" class="w-5 h-5" />
                  <span>{{ submission.language }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">耗时</span>
                <span>{{ submission.time }}</span>
              </div>
              <!--<div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">内存</span>
                <span>{{ submission.memory }}</span>
              </div>-->
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">提交时间</span>
                <span>{{ submission.submitTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.monaco-editor) {
  padding: 8px 0;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
