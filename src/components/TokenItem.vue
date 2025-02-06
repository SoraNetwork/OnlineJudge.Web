<script setup lang="ts">
import { useAttrs } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  Glyph: {
    type: String,
    default: "",
  },
  Token: {
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
      class="flex gap-2 items-center text-blue-900 dark:text-blue-300 bg-neutral-200/40 select-none dark:bg-neutral-700/40 px-4 py-0.5 rounded-xl font-semibold"
      :class="{
        'hover:underline': attrs.href,
        'active:underline': attrs.href,
      }"
    >
      <Icon :icon="Glyph" class="w-6 h-6" />
      <slot>
        {{ Token }}
      </slot>
    </div>
  </a>
</template>
