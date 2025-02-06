<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  show: boolean;
  title?: string;
  message: string;
  details?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <fluent-dialog :open="show" trap-focus modal class="w-full max-w-md">
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">{{ title || '错误' }}</h2>
      <p class="text-neutral-700 dark:text-neutral-300 mb-4">{{ message }}</p>
      
      <div v-if="details" class="mb-4">
        <div class="bg-neutral-100 dark:bg-neutral-700 p-4 rounded-md">
          <pre class="text-sm overflow-x-auto">{{ details }}</pre>
        </div>
      </div>

      <div class="flex justify-end">
        <fluent-button appearance="accent" @click="handleClose">
          确定
        </fluent-button>
      </div>
    </div>
  </fluent-dialog>
</template> 