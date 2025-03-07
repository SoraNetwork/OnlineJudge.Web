<script setup lang="ts">
import { defineProps } from 'vue'
import TokenItem from '@/components/TokenItem.vue'
import { useRouter } from 'vue-router'
import HyperlinkButton from './HyperlinkButton.vue'
import { Icon } from '@iconify/vue'

const router = useRouter()

export interface Activity {
  id: string
  type: string
  title: string
  target: string
  targetId: string
  result: string
  time: string
}

interface Props {
  activities: Activity[]
  title?: string
  showViewAllButton?: boolean
  maxCount?: number
  allButtonLink?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '最近活动记录',
  showViewAllButton: false,
  maxCount: undefined,
  allButtonLink: '/profile',
})

// 活动类型图标映射
const activityIcons: Record<string, string> = {
  '做题': 'fluent:code-20-regular',
  '比赛': 'fluent:trophy-20-filled',
  '提交': 'fluent:send-20-regular',
  '讨论': 'fluent:chat-20-regular'
}

// 结果状态图标映射
const statusIcons: Record<string, string> = {
  '通过': 'fluent:checkmark-circle-20-filled',
  '未通过': 'fluent:dismiss-circle-20-filled',
  '失败': 'fluent:dismiss-circle-20-filled',
  '完成': 'fluent:checkmark-circle-20-filled',
  '参与': 'fluent:person-20-filled',
  '发布': 'fluent:chat-20-filled'
}

const statusColors: Record<string, string> = {
  '通过': 'text-green-600 dark:text-green-400',
  '未通过': 'text-red-600 dark:text-red-400',
  '失败': 'text-red-600 dark:text-red-400',
  '完成': 'text-green-600 dark:text-green-400',
  '参与': 'text-blue-600 dark:text-blue-400',
  '发布': 'text-purple-600 dark:text-purple-400'
}

const getStatusColor = (status: string): string => {
  for (const key in statusColors) {
    if (status.includes(key)) return statusColors[key];
  }
  return 'text-neutral-600 dark:text-neutral-400';
}

const getStatusIcon = (status: string): string => {
  for (const key in statusIcons) {
    if (status.includes(key)) return statusIcons[key];
  }
  return 'fluent:info-20-regular';
}

const getActivityLink = (activity: Activity): string => {
  switch (activity.type) {
    case '做题':
    case '提交':
      return `/questions/${activity.targetId}`;
    case '比赛':
      return `/contests/${activity.targetId}`;
    case '讨论':
      return `/discuss/${activity.targetId}`;
    default:
      return '#';
  }
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
      <div v-for="activity in maxCount ? activities.slice(0, maxCount) : activities" 
           :key="activity.id"
           class="p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-2">
            <TokenItem :Token="activity.type" :Glyph="activityIcons[activity.type] || 'fluent:info-20-regular'" />
            <HyperlinkButton 
              class="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold"
              @click="navigate(getActivityLink(activity))">
              {{ activity.target }}
            </HyperlinkButton>
          </div>
          <div class="flex items-center gap-1" :class="getStatusColor(activity.result)">
            <Icon :icon="getStatusIcon(activity.result)" class="w-4 h-4" />
            <span class="text-sm">{{ activity.result }}</span>
          </div>
        </div>
        <div class="text-sm text-neutral-600 dark:text-neutral-400">
          <div class="flex items-center gap-2">
            <span>{{ activity.title }}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <Icon icon="fluent:clock-20-regular" class="w-4 h-4" />
            <span>{{ activity.time }}</span>
          </div>
        </div>
      </div>
      <div v-if="activities.length === 0" 
           class="text-center text-neutral-500 dark:text-neutral-400 py-4">
        暂无活动记录
      </div>
    </div>
  </div>
</template>
