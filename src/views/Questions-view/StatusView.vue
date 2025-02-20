<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import TokenItem from '@/components/TokenItem.vue'

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
  time: string;
  memory: string;
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

// 状态选项
const statusOptions = ref<StatusOption[]>([
  { value: 'all', label: '全部' },
  { value: 'ac', label: 'Accepted', icon: 'fluent:checkmark-20-filled' },
  { value: 'wa', label: 'Wrong Answer', icon: 'fluent:dismiss-20-filled' },
  { value: 'tle', label: 'Time Limit Exceeded', icon: 'fluent:timer-20-filled' },
  { value: 'mle', label: 'Memory Limit Exceeded', icon: 'fluent:warning-20-filled' },
  { value: 're', label: 'Runtime Error', icon: 'fluent:error-circle-20-filled' },
  { value: 'ce', label: 'Compile Error', icon: 'fluent:code-20-filled' },
])

// 语言选项
const languageOptions = ref<LanguageOption[]>([
  { value: 'all', label: '全部', icon: 'fluent:question-circle-20-filled' },
  { value: 'cpp', label: 'C++', icon: 'vscode-icons:file-type-cpp3' },
  { value: 'python', label: 'Python', icon: 'vscode-icons:file-type-python' },
  { value: 'java', label: 'Java', icon: 'vscode-icons:file-type-java' },
  { value: 'javascript', label: 'JavaScript', icon: 'vscode-icons:file-type-js-official' },
])

// 查询条件
const filters = ref<Filters>({
  status: 'all',
  language: 'all',
  username: '',
  problemId: ''
})

// 评测记录数据
const submissions = ref<Submission[]>([
  {
    id: '1001',
    problemId: 'P1001',
    problemTitle: 'A + B Problem',
    username: 'user1',
    status: 'Accepted',
    language: 'C++',
    time: '100ms',
    memory: '10.5MB',
    submitTime: '2024-01-20 12:30:45',
    code: '#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}'
  },
  {
    id: '1002',
    problemId: 'P1002',
    problemTitle: '过河卒',
    username: 'user2',
    status: 'Wrong Answer',
    language: 'Python',
    time: '150ms',
    memory: '12.3MB',
    submitTime: '2024-01-20 12:25:30',
    code: 'def main():\n    a, b = map(int, input().split())\n    print(a + b)\n\nif __name__ == "__main__":\n    main()'
  },
  // 更多提交记录...
])

// 分页数据
const pagination = ref<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 100
})

// 代码查看对话框
const isCodeDialogOpen = ref(false)
import type { Ref } from 'vue'

const selectedSubmission = ref<Submission | null>(null)

const showCode = (submission: Submission): void => {
  selectedSubmission.value = submission
  isCodeDialogOpen.value = true
}

const handlePageChange = (page: number): void => {
  pagination.value.currentPage = page
  // 这里应该调用API重新加载数据
}

const handleSearch = (): void => {
  // 实现搜索逻辑
  console.log('Search with filters:', filters.value)
}

const getStatusIcon = (status: string): string => {
  const option = statusOptions.value.find(opt => opt.label === status)
  return option?.icon || 'fluent:question-circle-20-filled'
}

const getLanguageIcon = (language: string): string => {
  const option = languageOptions.value.find(opt => opt.label === language)
  return option?.icon || 'fluent:code-20-filled'
}

const getSelectedStatusOption = computed(() => {
  return statusOptions.value.find(opt => opt.value === filters.value.status) || statusOptions.value[0]
})
</script>

<template>
  <div class="min-h-[95vh] bg-white dark:bg-neutral-900">
    <div class="container mx-auto px-4 py-6">
      <!-- 查询条件 -->
      <div class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 状态筛选 -->
          <fluent-menu>
            <fluent-button slot="trigger" appearance="outline">
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
          <fluent-menu>
            <fluent-button slot="trigger" appearance="outline">
              <div class="flex items-center gap-2">
                <Icon :icon="getLanguageIcon(filters.language)" class="w-5 h-5"/>
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
          >
            <Icon icon="fluent:person-20-filled" slot="start" class="w-5 h-5"/>
          </fluent-text-input>

          <!-- 题目ID搜索 -->
          <fluent-text-input
            v-model="filters.problemId"
            placeholder="题目ID"
          >
            <Icon icon="fluent:document-20-filled" slot="start" class="w-5 h-5"/>
          </fluent-text-input>
        </div>

        <div class="mt-4 flex justify-end">
          <fluent-button appearance="accent" @click="handleSearch">
            <Icon icon="fluent:search-20-filled" class="w-5 h-5 mr-2"/>
            搜索
          </fluent-button>
        </div>
      </div>

      <!-- 评测记录列表 -->
      <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden">
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
                <a class="text-blue-600 dark:text-blue-400 hover:underline">
                  {{ submission.problemId }}. {{ submission.problemTitle }}
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <TokenItem 
                  :Token="submission.status"
                  :Glyph="getStatusIcon(submission.status)"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <a class="text-blue-600 dark:text-blue-400 hover:underline">
                  {{ submission.username }}
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <Icon :icon="getLanguageIcon(submission.language)" class="w-5 h-5"/>
                  <span>{{ submission.language }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {{ submission.time }} / {{ submission.memory }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {{ submission.submitTime }}
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

      <!-- 分页 -->
      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-neutral-500 dark:text-neutral-400">
          共 {{ pagination.total }} 条记录
        </div>
        <div class="flex gap-2">
          <fluent-button 
            appearance="outline"
            :disabled="pagination.currentPage === 1"
            @click="handlePageChange(pagination.currentPage - 1)"
          >
            上一页
          </fluent-button>
          <span class="px-4 py-2">
            第 {{ pagination.currentPage }} 页
          </span>
          <fluent-button 
            appearance="outline"
            :disabled="pagination.currentPage * pagination.pageSize >= pagination.total"
            @click="handlePageChange(pagination!.currentPage + 1)"
          >
            下一页
          </fluent-button>
        </div>
      </div>

      <!-- 代码查看对话框 -->
      <fluent-dialog 
        :open="isCodeDialogOpen"
        @close="isCodeDialogOpen= false"
        class="w-3/4 h-3/4"
      >
        <div class="p-4" v-if="selectedSubmission">
          <h2 class="text-xl font-bold mb-4">提交详情</h2>
          <div class="mb-4">
            <div class="grid grid-cols-2 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
              <div>提交ID: {{ selectedSubmission!.id}}</div>
              <div>题目: {{ selectedSubmission!.problemId }}. {{ selectedSubmission!.problemTitle }}</div>
              <div>用户: {{ selectedSubmission!.username }}</div>
              <div>语言: {{ selectedSubmission!.language }}</div>
              <div>状态: {{ selectedSubmission!.status }}</div>
              <div>提交时间: {{ selectedSubmission!.submitTime }}</div>
            </div>
          </div>
          <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800">
            <pre class="text-sm"><code>{{ selectedSubmission!.code }}</code></pre>
          </div>
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
</style>
