<script setup lang="ts">
import { useAttrs } from "vue";

const props = defineProps({
  Content: {
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
  <a v-bind="attrs">
    <fluent-button
      appearance="transparent"
      @click="handleClick"
      :class="[
        $attrs.class,
        'min-w-0 flex rounded-sm font-normal gap-1 px-3 py-1 select-none hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-200 dark:active:bg-neutral-700 text-blue-900 active:text-blue-800 dark:text-blue-200 dark:active:text-blue-300 transition',
      ]"
      style="font-size: 15px"
    >
      <slot>
        {{ Content }}
      </slot>
    </fluent-button>
  </a>
</template>
