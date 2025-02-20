<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import TokenItem from '@/components/TokenItem.vue'
import * as monaco from 'monaco-editor'

const route = useRoute()
const router = useRouter()
const submissionId = route.params.id

interface TestCase {
  id: number
  status: string
  time: string
  memory: string
  input?: string
  output?: string
  expected?: string
  message?: string
}

interface SubmissionDetail {
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
}

const submission = ref<SubmissionDetail>({
  id: '1001',
  problemId: 'P1001',
  problemTitle: 'A + B Problem',
  username: 'user1',
  status: 'Wrong Answer',
  language: 'C++',
  time: '100ms',
  memory: '10.5MB',
  submitTime: '2024-01-20 12:30:45',
  code: '#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}',
  testCases: [
    {
      id: 1,
      status: 'Accepted',
      time: '2ms',
      memory: '1.2MB',
      input: '1 2',
      output: '3',
      expected: '3'
    },
    {
      id: 2,
      status: 'Wrong Answer',
      time: '3ms',
      memory: '1.2MB',
      input: '5 7',
      output: '13',
      expected: '12'
    }
  ]
})

const editorInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(null)
const editorContainer = ref<HTMLElement | null>(null)

// 获取状态图标
const getStatusIcon = (status: string): string => {
  const iconMap: Record<string, string> = {
    'Accepted': 'fluent:checkmark-20-filled',
    'Wrong Answer': 'fluent:dismiss-20-filled',
    'Time Limit Exceeded': 'fluent:timer-20-filled',
    'Memory Limit Exceeded': 'fluent:warning-20-filled',
    'Runtime Error': 'fluent:error-circle-20-filled',
    'Compile Error': 'fluent:code-20-filled'
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
  router.push('/status')
}

onMounted(() => {
  // 初始化代码编辑器
  if (editorContainer.value) {
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
          <fluent-button appearance="outline" @click="handleBack">
            <Icon icon="fluent:arrow-left-20-filled" class="w-5 h-5"/>
          </fluent-button>
          <h1 class="text-xl font-bold">提交记录 #{{ submission.id }}</h1>
        </div>
      </div>

      <!-- 提交信息卡片 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <!-- 代码区域 -->
          <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden mb-6">
            <div class="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon :icon="getLanguageIcon(submission.language)" class="w-5 h-5"/>
                <span>{{ submission.language }}</span>
              </div>
              <TokenItem :Token="submission.status" :Glyph="getStatusIcon(submission.status)"/>
            </div>
            <div ref="editorContainer" class="h-[400px]"></div>
          </div>

          <!-- 测试点详情 -->
          <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden">
            <div class="bg-neutral-100 dark:bg-neutral-800 px-4 py-3">
              <h2 class="font-semibold">测试点信息</h2>
            </div>
            <div class="divide-y divide-neutral-200 dark:divide-neutral-700">
              <div v-for="testCase in submission.testCases" :key="testCase.id"
                class="p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <span class="font-medium">测试点 #{{ testCase.id }}</span>
                    <TokenItem :Token="testCase.status" :Glyph="getStatusIcon(testCase.status)"/>
                  </div>
                  <div class="text-sm text-neutral-600 dark:text-neutral-400">
                    <span class="mr-4">耗时: {{ testCase.time }}</span>
                    <span>内存: {{ testCase.memory }}</span>
                  </div>
                </div>
                <div v-if="testCase.status !== 'Accepted'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="testCase.input" class="space-y-2">
                    <div class="font-medium text-sm">输入：</div>
                    <pre class="bg-neutral-50 dark:bg-neutral-800 p-2 rounded text-sm overflow-x-auto">{{ testCase.input }}</pre>
                  </div>
                  <div v-if="testCase.output" class="space-y-2">
                    <div class="font-medium text-sm">输出：</div>
                    <pre class="bg-neutral-50 dark:bg-neutral-800 p-2 rounded text-sm overflow-x-auto">{{ testCase.output }}</pre>
                  </div>
                  <div v-if="testCase.expected" class="space-y-2">
                    <div class="font-medium text-sm">期望输出：</div>
                    <pre class="bg-neutral-50 dark:bg-neutral-800 p-2 rounded text-sm overflow-x-auto">{{ testCase.expected }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交信息侧边栏 -->
        <div class="lg:col-span-1">
          <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-6">
            <h2 class="text-lg font-semibold mb-4">提交信息</h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">提交ID</span>
                <span>{{ submission.id }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">题目</span>
                <a class="text-blue-600 dark:text-blue-400 hover:underline">
                  {{ submission.problemId }}. {{ submission.problemTitle }}
                </a>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">用户</span>
                <a class="text-blue-600 dark:text-blue-400 hover:underline">
                  {{ submission.username }}
                </a>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">状态</span>
                <TokenItem :Token="submission.status" :Glyph="getStatusIcon(submission.status)"/>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">语言</span>
                <div class="flex items-center gap-2">
                  <Icon :icon="getLanguageIcon(submission.language)" class="w-5 h-5"/>
                  <span>{{ submission.language }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">耗时</span>
                <span>{{ submission.time }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">内存</span>
                <span>{{ submission.memory }}</span>
              </div>
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
