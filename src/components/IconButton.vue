<script setup lang="ts">
import { ref, useAttrs } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  Glyph: {
    type: String,
    default: "",
  },
  ToolTip: {
    type: String,
    default: "",
  },
  OnClick: {
    type: Function,
    required: false,
  },
  Text: {
    type: String,
  
    required: false,
  },
});

const attrs = useAttrs();
const emit = defineEmits();

const buttonId = ref(`icon-button-${Math.random().toString(36).substr(2, 9)}`);

const handleClick = (event: MouseEvent) => {
  if (props.OnClick) props.OnClick(event);
  emit("click", event);
};
</script>

<template>
  <a v-bind="attrs">
    <fluent-button
      :id="buttonId"
      appearance="transparent"
      @click="handleClick"
      :class="[
        $attrs.class,
        'min-w-0 px-2 py-1.5 rounded-sm transition hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-200 dark:active:bg-neutral-700',
      ]"
      style="font-size: 15px"
    >
      <slot>
        <Icon :icon="Glyph" class="w-5 h-5" />
      </slot>
      {{ Text }}
    </fluent-button>
    <fluent-tooltip
      v-if="ToolTip"
      positioning="below"
      :anchor="buttonId"
      class="p-2 mt-2"
    >
      {{ ToolTip }}
    </fluent-tooltip>
  </a>
</template>
