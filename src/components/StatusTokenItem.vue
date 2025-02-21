<script setup lang='ts'>
import TokenItem from './TokenItem.vue';

const props = defineProps<{
  status: string;
}>();

const statusOptions = {
  'Accepted': { icon: 'fluent:checkmark-20-filled' },
  'Wrong Answer': { icon: 'fluent:dismiss-20-filled' },
  'Time Limit Exceeded': { icon: 'fluent:timer-20-filled' },
  'Memory Limit Exceeded': { icon: 'fluent:warning-20-filled' },
  'Runtime Error': { icon: 'fluent:error-circle-20-filled' },
  'Compile Error': { icon: 'fluent:code-20-filled' }
}

const getStatusIcon = (status: string): string => {
  return statusOptions[status as keyof typeof statusOptions]?.icon || 'fluent:question-circle-20-filled'
}
</script>

<template>
  <TokenItem :Token="status" :Glyph="getStatusIcon(status)" />
</template>
