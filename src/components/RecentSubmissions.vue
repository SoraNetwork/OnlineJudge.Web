<script setup lang="ts">
import { defineProps } from 'vue'
import StatusTokenItem from '@/components/StatusTokenItem.vue'
import { useRouter } from 'vue-router'
import HyperlinkButton from './HyperlinkButton.vue'
import { Icon } from '@iconify/vue'

const router = useRouter()

export interface Submission {
  id: string
  status: string
  time: string
  memory: string
  language: string
  submitTime: string
  username?: string
  questionId?: string
}

interface Props {
  submissions: Submission[]
  showUsername?: boolean
  title?: string
  showViewAllButton?: boolean  
  showQuestionLink?: boolean
  maxCount?: number
  allButtonLink?: string
}

const props = withDefaults(defineProps<Props>(), {
  showUsername: false,
  title: '最近提交',
  showViewAllButton: false,  
  showQuestionLink: false,
  allButtonLink: '/questions/status/all',
})

// 语言图标映射
const languageIcons: Record<string, string> = {
  'C++': 'vscode-icons:file-type-cpp3',
  'Python': 'vscode-icons:file-type-python',
  'Java': 'vscode-icons:file-type-java',
  'JavaScript': 'vscode-icons:file-type-js-official'
}

const navigate = (path: string) => {
  window.scrollTo(0, 0)
  router.push(path)
}
</script>

<template>
  <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">{{ title }}</h2>
      <fluent-button v-if="showViewAllButton"
              @click="navigate(allButtonLink)"
              class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
        查看全部
      </fluent-button>
    </div>
    <div class="flex flex-col gap-3">
      <div v-for="submission in maxCount?submissions.slice(0, maxCount):submissions" 
           :key="submission.id"
           class="p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <div class="flex items-center gap-2">
          <HyperlinkButton v-if="showQuestionLink && submission.questionId" 
                class="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold"
                @click="navigate(`/questions/${submission.questionId}`)">
            {{ submission.questionId }}
          </HyperlinkButton>

          <StatusTokenItem :status="submission.status" />
          <span v-if="showUsername && submission.username" 
                class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ submission.username }}
          </span>
        </div>
        <div class="text-sm text-neutral-600 dark:text-neutral-400">
          <div class="flex items-center gap-2">
            <span>{{ submission.submitTime }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="flex items-center gap-1">
              <Icon 
                :icon="languageIcons[submission.language] || 'vscode-icons:file-type-text'" 
                class="w-4 h-4" 
              />
              {{ submission.language }}
            </span>
            <span class="text-neutral-400">|</span>
            <span>{{ submission.time }}</span>
            <span class="text-neutral-400">|</span>
            <span>{{ submission.memory }}</span>
          </div>
        </div>
      </div>
      <div v-if="submissions.length === 0" 
           class="text-center text-neutral-500 dark:text-neutral-400 py-4">
        暂无提交记录
      </div>
    </div>
  </div>
</template>
