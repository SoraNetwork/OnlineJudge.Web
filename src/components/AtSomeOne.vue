<script setup lang="ts">
import { useAttrs } from "vue";

const props = defineProps({
  Name: {
    type: String,
    default: "",
  },
  OnClick: {
    type: Function,
    required: false,
  },
});

const attrs = useAttrs();
const emit = defineEmits();
const handleClick = (event: MouseEvent) => {
  if (props.OnClick) props.OnClick(event);
  emit("click", event);
};
</script>

<template>
  <a v-bind="attrs" @click="handleClick">
    <div
      class="flex mx-2 gap-2 items-center hover:underline text-blue-900 dark:text-blue-300 bg-neutral-200/40 select-none dark:bg-neutral-700/40 px-2 rounded-lg font-semibold"
      :class="{
        'hover:underline': attrs.href,
        'active:underline': attrs.href,
      }"
    >
      <slot> @{{ Name }} </slot>
    </div>
  </a>
</template>
