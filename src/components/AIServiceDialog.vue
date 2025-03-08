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
// 替换模拟数据导入为实际API导入
import { generateQuestionByAI, generateTestcasesByAI } from '@/api/questionApi'

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
// 添加长时间等待警告状态
const showWaitingWarning = ref(false)
const waitingTimer = ref(null)
// 添加超时警告状态
const showTimeoutWarning = ref(false)
const timeoutTimer = ref(null)
// 存储题目信息
const problemTitle = ref('')
const problemDescription = ref('')

// 显示对话框 - 接收额外参数
const show = (data = {}) => {
    dialog.value?.show()
    reset()
    
    // 保存传递的题目信息
    if (data.title) problemTitle.value = data.title
    if (data.description) problemDescription.value = data.description
}

// 重置状态
const reset = () => {
    step.value = 'input'
    prompt.value = ''
    previewData.value = null
    isLoading.value = false
    errorMessage.value = ''
    customTestcaseCount.value = props.testcaseCount
    showWaitingWarning.value = false
    showTimeoutWarning.value = false
    problemTitle.value = ''
    problemDescription.value = ''
    // 确保清除计时器
    if (waitingTimer.value) {
        clearTimeout(waitingTimer.value)
        waitingTimer.value = null
    }
    if (timeoutTimer.value) {
        clearTimeout(timeoutTimer.value)
        timeoutTimer.value = null
    }
}

// 隐藏对话框
const hide = () => {
    dialog.value?.hide()
    reset()
}

// 处理提交 - 替换为实际API调用
const handleSubmit = async () => {
  if (!prompt.value.trim()) return

  try {
    isLoading.value = true
    clearError()
    
    // 设置计时器，10秒后显示等待警告
    waitingTimer.value = setTimeout(() => {
      showWaitingWarning.value = true
    }, 10000)
    
    // 设置两分钟超时警告计时器
    timeoutTimer.value = setTimeout(() => {
      showTimeoutWarning.value = true
    }, 120000)
    
    let response
    
    if (props.mode === 'problem') {
      // 调用生成题目描述API
      response = await generateQuestionByAI({
        description: prompt.value
      })
      
      if (response.success) {
        previewData.value = response.data
      } else {
        // 更清晰地指明是 AI 生成失败，而非系统错误
        throw new Error(response.message || 'AI生成题目描述失败，请调整描述后再次尝试')
      }
    } else {
      // 构建完整的描述信息
      const fullDescription = `
题目标题: ${problemTitle.value}

题目描述:
${problemDescription.value}

测试点要求:
${prompt.value}
      `.trim()
      
      // 调用生成测试用例API，传入完整描述
      response = await generateTestcasesByAI({
        title: problemTitle.value,
        description: fullDescription,
        testCaseCount: customTestcaseCount.value
      })
      
      if (response.success) {
        try {
          // 解析返回的JSON字符串
          const testCaseData = JSON.parse(response.data)
          
          // 将API返回的数据转换为组件需要的格式
          previewData.value = testCaseData.testCases.map(tc => ({
            input: tc.input,
            output: tc.expectedOutput,
            score: Math.floor(100 / testCaseData.testCases.length) // 平均分配分数
          }))
        } catch (jsonError) {
          // 专门处理JSON解析错误
          throw new Error('AI生成的数据格式不规范，请重新尝试或调整描述')
        }
      } else {
        // 更清晰地指明是 AI 生成失败，而非系统错误
        throw new Error(response.message || 'AI生成测试用例失败，请调整描述后再次尝试')
      }
    }
    
    step.value = 'preview'
  } catch (error) {
    // 区分错误类型
    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      errorMessage.value = 'AI生成的数据格式不规范，请重新尝试或调整描述'
    } else if (error.response && error.response.status === 400) {
      errorMessage.value = 'AI生成失败，请调整提示词后再次尝试'
    } else {
      errorMessage.value = error.message || '服务暂时不可用，请稍后重试'
    }
  } finally {
    isLoading.value = false
    // 清除等待警告和计时器
    showWaitingWarning.value = false
    showTimeoutWarning.value = false
    if (waitingTimer.value) {
      clearTimeout(waitingTimer.value)
      waitingTimer.value = null
    }
    if (timeoutTimer.value) {
      clearTimeout(timeoutTimer.value)
      timeoutTimer.value = null
    }
  }
}

// 关闭错误提示
const clearError = () => {
  errorMessage.value = ''
}

// 关闭警告提示
const clearWarning = () => {
  showWaitingWarning.value = false
}

// 关闭超时警告提示
const clearTimeoutWarning = () => {
  showTimeoutWarning.value = false
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

      <!-- 长时间等待警告 -->
      <AlertMessage
        :duration="0"
        v-if="showWaitingWarning && isLoading && !showTimeoutWarning"
        type="warning"
        message="DeepSeek正在深度求索中，请稍等片刻，这可能需要亿点时间..."
        class="mb-4"
        @close="clearWarning"
      />
      
      <!-- 超时警告 -->
      <AlertMessage
        :duration="0"
        v-if="showTimeoutWarning && isLoading"
        type="error"
        message="deepseek似乎已经深度求索很久了，可能是难度太高了，建议更换后再试。或者你也可以试试一直等下去呢？"
        class="mb-4"
        @close="clearTimeoutWarning"
      />

      <!-- 输入界面 -->
      <div v-if="step === 'input'" class="space-y-4">
        <!-- 显示当前题目信息 (仅在测试点模式下) -->
        <div v-if="mode === 'testcase' && problemDescription" class="space-y-2">
          <div v-if="problemTitle" class="font-medium mb-1">当前题目: {{ problemTitle }}</div>
          <div class="text-xs text-neutral-600 dark:text-neutral-400 mb-2">AI将根据当前题目描述生成合适的测试点</div>
        </div>

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
                建议范围：1-10
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
            <div class="dark:invert">
              <Editor
                :value="previewData"
                :plugins="plugins"
                :locale="zhHans"
                previewOnly
              />
            </div>
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
            src="/deepseek.webp"
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
