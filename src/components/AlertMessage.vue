<script setup lang='ts'>
import { Icon } from '@iconify/vue'

type AlertType = 'error' | 'warning' | 'info' | 'success'

const props = defineProps({
  type: {
    type: String as () => AlertType,
    default: 'error',
    validator: (value: string): boolean => ['error', 'warning', 'info', 'success'].includes(value)
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const typeConfig: Record<AlertType, { icon: string; class: string }> = {
  error: {
    icon: 'fluent:error-circle-20-regular',
    class: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
  },
  warning: {
    icon: 'fluent:warning-20-regular',
    class: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
  },
  info: {
    icon: 'fluent:info-20-regular',
    class: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
  },
  success: {
    icon: 'fluent:checkmark-circle-20-regular',
    class: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
  }
}
</script>

<template>
  <div 
    class="flex items-center gap-3 px-4 py-3 rounded-lg border transition-all"
    :class="typeConfig[type].class"
  >
    <Icon :icon="typeConfig[type].icon" class="w-5 h-5 flex-shrink-0" />
    <span class="flex-grow text-sm">{{ message }}</span>
    <button 
      @click="emit('close')"
      class="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
    >
      <Icon icon="fluent:dismiss-20-regular" class="w-4 h-4" />
    </button>
  </div>
</template>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* 添加进入离开动画 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 为关闭按钮添加缩放动画 */
button:active {
  transform: scale(0.95);
}
</style>
