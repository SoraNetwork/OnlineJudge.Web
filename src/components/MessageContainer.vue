<script setup lang="ts">
import { useMessages } from '../services/MessageService'
import AlertMessage from './AlertMessage.vue'
import { TransitionGroup } from 'vue'

const { messages, removeMessage } = useMessages()
</script>

<template>
  <div class="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-md">
    <TransitionGroup name="message">
      <AlertMessage
        v-for="msg in messages" 
        :key="msg.id"
        :type="msg.type"
        :message="msg.content"
        :duration="msg.duration"
        @close="() => removeMessage(msg.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.message-move {
  transition: transform 0.3s ease;
}
</style>
