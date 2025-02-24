<script setup lang="ts">
import { computed, useAttrs } from 'vue';

interface AvatarProps {
  name: string;
  image?: string;
}

const props = withDefaults(defineProps<AvatarProps>(), {
  image: ''
});

const  attrs  = useAttrs();
const getInitials = (name:string) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};
</script>

<template>
  <div v-if="image" v-bind="attrs" >
    <fluent-avatar :image="image" />
  </div>
  <div v-else v-bind="attrs">
    <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-sm font-medium">
      {{ getInitials(name) }}
    </fluent-badge>
  </div>
</template>
