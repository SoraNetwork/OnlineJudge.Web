<script setup lang='ts'>
import TokenItem from './TokenItem.vue';

const props = defineProps<{
  status: string;
}>();

const statusOptions = {
  'Accepted': { icon: 'fluent:checkmark-20-filled' },
  'WrongAnswer': { icon: 'fluent:dismiss-20-filled' },
  'TimeLimitExceeded': { icon: 'fluent:timer-20-filled' },
  'MemoryLimitExceeded': { icon: 'fluent:warning-20-filled' },
  'RuntimeError': { icon: 'fluent:error-circle-20-filled' },
  'CompileError': { icon: 'fluent:code-20-filled' },
  'DuplicateCodeError':{ icon: 'fluent:alert-20-filled' }
}

const getStatusIcon = (status: string): string => {
  return statusOptions[status as keyof typeof statusOptions]?.icon || 'fluent:question-circle-20-filled'
}
</script>

<template>
  <TokenItem :Token="status" :Glyph="getStatusIcon(status)" />
</template>
