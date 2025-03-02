<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Dialog } from '@fluentui/web-components'
import AlertMessage from './AlertMessage.vue'
import { Editor } from '@bytemd/vue-next'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import zhHans from 'bytemd/lib/locales/zh_Hans.json'
import { mockAiResponse } from '../utils/mockAiResponse'

const dialog = ref(null)

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    mode: {
        type: String,
        default: 'problem',
        validator: (value) => ['problem', 'testcase'].includes(value)
    },
    testcaseCount: {
        type: Number,
        default: 10
    }
})

const plugins = [gfm(), highlight(), math()]

const emit = defineEmits(['submit', 'confirm', 'cancel'])

// 状态管理
const step = ref('input')
const prompt = ref('')
const isLoading = ref(false)
const previewData = ref(null)
const errorMessage = ref('')
const customTestcaseCount = ref(props.testcaseCount)

// 显示对话框
const show = () => {
    dialog.value?.show()
    reset()
}

// 重置状态
const reset = () => {
    step.value = 'input'
    prompt.value = ''
    previewData.value = null
    isLoading.value = false
    errorMessage.value = ''
    customTestcaseCount.value = props.testcaseCount
}

// 隐藏对话框
const hide = () => {
    dialog.value?.hide()
    reset()
}

// 处理提交
const handleSubmit = async () => {
  if (!prompt.value.trim()) return

  try {
    isLoading.value = true
    clearError()
    // 使用模拟数据，传入用户设置的测试点个数
    const response = await mockAiResponse(props.mode, prompt.value, customTestcaseCount.value)
    previewData.value = response
    step.value = 'preview'
  } catch (error) {
    errorMessage.value = error.message || '生成失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 关闭错误提示
const clearError = () => {
  errorMessage.value = ''
}

// 处理确认
const handleConfirm = () => {
    emit('confirm', previewData.value)
    hide()
}

// 返回输入
const handleBack = () => {
    step.value = 'input'
}

// 处理取消
const handleCancel = () => {
    emit('cancel')
    hide()
}

// 暴露方法给父组件
defineExpose({
    show,
    hide,
    reset
})
</script>

<template>
  <fluent-dialog ref="dialog" trap-focus modal class="w-full max-w-3xl">
    <div class="p-6 w-full">
      <!-- 标题栏 -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">{{ title || 'AI 助手' }}</h2>
        <fluent-button appearance="lightweight" @click="handleCancel">
          <Icon icon="fluent:dismiss-20-regular" class="w-5 h-5" />
        </fluent-button>
      </div>

      <!-- 错误消息 -->
      <AlertMessage
        v-if="errorMessage"
        type="error"
        :message="errorMessage"
        class="mb-4"
        @close="clearError"
      />

      <!-- 输入界面 -->
      <div v-if="step === 'input'" class="space-y-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {{ mode === 'problem' ? '请描述您想要生成的题目类型或特点' : '请描述您想要生成的测试数据特点' }}
          </label>
          <fluent-textarea
            v-model="prompt"
            :rows="4"
            :placeholder="mode === 'problem' 
              ? '例如：生成一道关于动态规划的中等难度题目，主题是最长递增子序列...' 
              : '例如：生成一组边界情况的测试数据，包含全部相同的数字...'"
            class="min-w-full"
            auto-resize
            block
            @keydown.ctrl.enter="handleSubmit"
          />
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            提示：使用清晰的描述来获得更好的生成结果。按 Ctrl + Enter 快捷提交
          </p>
          <!-- 添加测试点个数输入框 -->
          <div v-if="mode === 'testcase'" class="mt-4">
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              测试点个数
            </label>
            <div class="flex items-center gap-2">
              <fluent-text-input
                v-model="customTestcaseCount"
                :min="1"
                :max="100"
                class="w-32"
                appearance="outline"
              />
              <span class="text-sm text-neutral-500">
                建议范围：1-100
              </span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-3">
          <fluent-button appearance="secondary" @click="handleCancel">
            取消
          </fluent-button>
          <fluent-button
            appearance="accent"
            :disabled="isLoading || !prompt.trim()"
            @click="handleSubmit"
          >
            <Icon
              :icon="isLoading ? 'fluent:spinner-ios-20-regular' : 'fluent:send-20-filled'"
              class="w-5 h-5 mr-2"
              :class="{ 'animate-spin': isLoading }"
            />
            {{ isLoading ? '生成中...' : '生成预览' }}
          </fluent-button>
        </div>
      </div>

      <!-- 预览界面 -->
      <div v-else-if="step === 'preview'" class="space-y-4">
        <!-- 题目描述预览 -->
        <div v-if="mode === 'problem'" class="space-y-4">
          <div class="border rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900">
            <Editor
              :value="previewData"
              :plugins="plugins"
              :locale="zhHans"
              previewOnly
            />
          </div>
        </div>

        <!-- 测试点预览 -->
        <div v-else-if="mode === 'testcase'" class="space-y-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium">测试数据预览</h3>
            <span class="text-sm text-neutral-500">
              共 {{ previewData?.length || 0 }}/{{ customTestcaseCount }} 个测试点
            </span>
          </div>
          <div v-for="(test, index) in previewData" :key="index"
               class="border rounded-lg p-4 space-y-3">
            <h3 class="font-medium">测试点 #{{ index + 1 }}</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-neutral-500 mb-1">输入：</div>
                <pre class="bg-neutral-50 dark:bg-neutral-900 p-2 rounded">{{ test.input }}</pre>
              </div>
              <div>
                <div class="text-sm text-neutral-500 mb-1">输出：</div>
                <pre class="bg-neutral-50 dark:bg-neutral-900 p-2 rounded">{{ test.output }}</pre>
              </div>
            </div>
            <div class="text-sm text-neutral-500">
              分值：{{ test.score }}
            </div>
          </div>
        </div>

        <!-- 预览操作按钮 -->
        <div class="flex justify-end gap-3">
          <fluent-button appearance="secondary" @click="handleBack">
            <Icon icon="fluent:arrow-left-20-filled" class="w-5 h-5 mr-2" />
            返回修改
          </fluent-button>
          <fluent-button appearance="accent" @click="handleConfirm">
            <Icon icon="fluent:checkmark-20-filled" class="w-5 h-5 mr-2" />
            确认使用
          </fluent-button>
        </div>
      </div>

      <!-- 服务提供商信息 -->
      <div class="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div class="flex items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span>由</span>
          <img 
            alt="DeepSeek Logo" 
            loading="lazy" 
            width="28" 
            height="28" 
            decoding="async" 
            data-nimg="1" 
            class="w-25 h-5" 
            style="color:transparent" 
            src="https://www.deepseek.com/_next/image?url=https%3A%2F%2Fcdn.deepseek.com%2Flogo.png&amp;w=1920&amp;q=75"
          />
          <span>提供支持</span>
          <span class="mx-2">·</span>
          <span>阿里云提供计算服务</span>
        </div>
      </div>

    </div>
  </fluent-dialog>
</template>

<style scoped>
:deep(fluent-dialog) {
  --dialog-width: min(48rem, 90vw);
  --dialog-height: auto;
}

:deep(fluent-textarea) {
  min-height: 120px;
  height: auto;
  resize: vertical;
  width: 100% !important;
  display: block;
  box-sizing: border-box;
}

:deep(fluent-textarea::part(control)) {
  width: 100%;
  min-width: 100%;
  box-sizing: border-box;
}

:deep(.markdown-body) {
  background: transparent;
}

:deep(.provider-info) {
  opacity: 0.8;
  transition: opacity 0.2s;
}

:deep(.provider-info:hover) {
  opacity: 1;
}
</style>
