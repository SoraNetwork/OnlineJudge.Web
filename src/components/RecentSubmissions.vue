<script setup lang="ts">
import { defineProps } from 'vue'
import StatusTokenItem from '@/components/StatusTokenItem.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  showViewAllButton?: boolean  // 新添加的属性
}

const props = withDefaults(defineProps<Props>(), {
  showUsername: false,
  title: '最近提交',
  showViewAllButton: false  // 默认不显示
})
</script>

<template>
  <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">{{ title }}</h2>
      <fluent-button v-if="showViewAllButton"
              @click="$router.push('/questions/status/all')"
              class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
        查看全部
      </fluent-button>
    </div>
    <div class="flex flex-col gap-3">
      <div v-for="submission in submissions" 
           :key="submission.id"
           class="p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <div class="flex items-center gap-2">
          <StatusTokenItem :status="submission.status" />
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
