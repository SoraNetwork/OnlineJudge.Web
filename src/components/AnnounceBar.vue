<script setup>
import { useAttrs } from "vue";
import { Icon } from "@iconify/vue";
const attrs = useAttrs();
</script>

<template>
  <div
    class="px-8 py-4 md:px-16 flex justify-center border-neutral-200 dark:border-neutral-800 border-t-1 border-b-1 text-blue-900 dark:text-blue-300 bg-neutral-100 dark:bg-neutral-900"
    v-bind="attrs"
  >
    <div
      class="flex gap-2 font-semibold md:text-lg items-start md:items-center"
    >
      <div class="flex gap-2 items-center">
        <Icon
          slot="end"
          icon="fluent:megaphone-loud-20-filled"
          class="w-5 h-5"
        />
        <p class="text-nowrap">公告：</p>
      </div>
      <slot> </slot>
    </div>
  </div>
</template>
