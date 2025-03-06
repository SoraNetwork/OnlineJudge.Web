<script setup lang="ts">
import { message } from '../services/MessageService'

function showSuccessMessage() {
  message.success('操作成功！')
}

function showErrorMessage() {
  message.error('发生错误，请重试', 5000) // 显示5秒
}

function showWarningMessage() {
  message.warning('请注意此操作可能存在风险')
}

function showInfoMessage() {
  message.info('系统将在今晚进行例行维护')
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">消息通知示例</h1>
    <div class="flex gap-4">
      <button class="px-4 py-2 bg-green-500 text-white rounded" @click="showSuccessMessage">
        显示成功消息
      </button>
      <button class="px-4 py-2 bg-red-500 text-white rounded" @click="showErrorMessage">
        显示错误消息
      </button>
      <button class="px-4 py-2 bg-yellow-500 text-white rounded" @click="showWarningMessage">
        显示警告消息
      </button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded" @click="showInfoMessage">
        显示信息消息
      </button>
    </div>
  </div>
</template>
