<script setup>
import { useAttrs, defineProps, defineEmits } from "vue";

const props = defineProps({
  Content: {
    type: String,
    default: "",
  },
  OnClick: {
    type: Function,
    required: false,
  },
  href: {
    type: String,
    default: undefined
  },
  size: {
    type: String,
    default: 'default' // default, small, large
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const attrs = useAttrs();
const emit = defineEmits(['click']);

const handleClick = (event) => {
  if (!props.disabled) {
    if (props.OnClick) props.OnClick(event);
    emit('click', event);
  }
};
</script>

<template>
  <a 
    v-if="href" 
    :href="href"
    :class="[
      'inline-flex items-center transition-colors focus:outline-none',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
    ]"
    @click.prevent="!disabled && handleClick($event)"
  >
    <slot>
      {{ Content }}
    </slot>
  </a>
  <button 
    v-else
    :class="[
      'inline-flex items-center transition-colors focus:outline-none bg-transparent p-0 m-0 border-0',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>
      {{ Content }}
    </slot>
  </button>
</template>
