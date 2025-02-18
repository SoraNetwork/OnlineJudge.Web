<script setup lang="ts">
import { defineProps } from 'vue'
import TokenItem from './TokenItem.vue'

interface Submission {
  id: string
  status: string
  time: string
  memory: string
  language: string
  submitTime: string
  username?: string
}

interface Props {
  submissions: Submission[]
  showUsername?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  showUsername: false,
  title: '最近提交'
})

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
</script>

<template>
  <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-4">
    <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>
    <div class="flex flex-col gap-3">
      <div v-for="submission in submissions" 
           :key="submission.id"
           class="p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <div class="flex items-center gap-2">
          <TokenItem :Token="submission.status" 
                    :Glyph="getStatusIcon(submission.status)"/>
          <span v-if="showUsername && submission.username" 
                class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ submission.username }}
          </span>
        </div>
        <div class="text-sm text-neutral-600 dark:text-neutral-400">
          <div>{{ submission.submitTime }}</div>
          <div>语言：{{ submission.language }}</div>
          <div>耗时：{{ submission.time }}</div>
          <div>内存：{{ submission.memory }}</div>
        </div>
      </div>
      <div v-if="submissions.length === 0" 
           class="text-center text-neutral-500 dark:text-neutral-400 py-4">
        暂无提交记录
      </div>
    </div>
  </div>
</template>
