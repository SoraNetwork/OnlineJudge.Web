<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});


// 根据size返回对应的尺寸类名
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-8 h-8';
    case 'lg': return 'w-12 h-12';
    default: return 'w-10 h-10';
  }
});
</script>

<template>
  <div :class="sizeClass">
    <div v-if="image" class="w-full h-full">
      <fluent-avatar :image="image" />
    </div>
    <div v-else class="w-full h-full">
        <fluent-avatar :name="name" />
    </div>
  </div>
</template>
