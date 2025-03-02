<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { Editor } from '@bytemd/vue-next'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import math from '@bytemd/plugin-math'
import zhHans from 'bytemd/lib/locales/zh_Hans.json'
import 'bytemd/dist/index.css'
import AIServiceDialog from '@/components/AIServiceDialog.vue'

const router = useRouter()

const plugins = [
  gfm(),
  highlight(),
  breaks(),
  frontmatter(),
  math()
]

const problem = ref({
  title: '',
  difficulty: '入门',
  timeLimit: 1000,
  memoryLimit: 256,
  tags: [],
  content: `## 问题描述

请在这里描述题目的具体要求...

## 输入格式

请描述输入数据的格式...

## 输出格式

请描述输出数据的格式...

## 样例输入

\`\`\`
在这里给出具体的输入样例
\`\`\`

## 样例输出

\`\`\`
在这里给出具体的输出样例
\`\`\`

## 数据范围

请描述输入数据的范围限制...
- 例如：1 ≤ n ≤ 100
- 例如：0 ≤ a[i] ≤ 1000

## 提示

可以在这里添加一些解题提示或说明...`,
  testCases: [
    { input: '', output: '', score: 10 }
  ]
})

const difficulties = ['入门', '简单', '中等', '困难']
const newTag = ref('')

const addTag = () => {
  if (newTag.value && !problem.value.tags.includes(newTag.value)) {
    problem.value.tags.push(newTag.value)
    newTag.value = ''
  }
}

const removeTag = (index) => {
  problem.value.tags.splice(index, 1)
}

// 删除 addSampleCase 和 removeSampleCase 方法

const addTestCase = () => {
  problem.value.testCases.push({ input: '', output: '', score: 10 })
}

const removeTestCase = (index) => {
  problem.value.testCases.splice(index, 1)
}

const handleSubmit = () => {
  console.log('提交题目:', problem.value)
  // 这里应该调用API保存题目
  router.push('/questions')
}

const handleBack = () => {
  router.back()
}

// AI 对话框引用
const aiProblemDialog = ref(null)
const aiTestCaseDialog = ref(null)

// AI 对话框标题
const aiDialogTitle = ref('')

// 模拟生成题目描述
const handleAIProblem = async (prompt) => {
  try {
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟生成的题目描述
    return `## 问题描述

根据您的提示："${prompt}"，生成以下题目：

一个长度为 n 的序列，需要找出其中的最长递增子序列。

## 输入格式

第一行一个整数 n，表示序列长度。
第二行 n 个整数 ai，表示序列中的每个数。

## 输出格式

输出一个整数，表示最长递增子序列的长度。

## 样例输入

\`\`\`
6
3 1 4 1 5 9
\`\`\`

## 样例输出

\`\`\`
4
\`\`\`

## 数据范围

- 1 ≤ n ≤ 1000
- 1 ≤ ai ≤ 10^9

## 提示

样例解释：最长递增子序列为 [1,4,5,9]，长度为 4。`
  } catch (error) {
    console.error('生成题目失败:', error)
    throw new Error('生成题目失败，请稍后重试')
  }
}

// 确认使用生成的题目描述
const handleConfirmProblem = (content) => {
  problem.value.content = content
}

// 模拟生成测试点
const handleAITestCase = async (prompt) => {
  try {
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟生成的测试点
    return [
      {
        input: '6\n3 1 4 1 5 9',
        output: '4',
        score: 20
      },
      {
        input: '8\n1 2 3 4 5 4 3 2',
        output: '5',
        score: 20
      },
      {
        input: '4\n1 1 1 1',
        output: '1',
        score: 20
      }
    ]
  } catch (error) {
    console.error('生成测试点失败:', error)
    throw new Error('生成测试点失败，请稍后重试')
  }
}

// 确认使用生成的测试点
const handleConfirmTestCase = (testCases) => {
  problem.value.testCases.push(...testCases)
}

// 显示 AI 题目生成对话框
const showAIProblemDialog = () => {
  aiDialogTitle.value = 'AI 生成题目描述'
  aiProblemDialog.value?.show()
}

// 显示 AI 测试点生成对话框
const showAITestCaseDialog = () => {
  aiDialogTitle.value = 'AI 生成测试点'
  aiTestCaseDialog.value?.show()
}

// 自动分配测试点分数
const autoDistributeScores = () => {
  const testCount = problem.value.testCases.length
  if (testCount === 0) return
  
  const baseScore = Math.floor(100 / testCount)
  const remainder = 100 - (baseScore * testCount)
  
  problem.value.testCases.forEach((test, index) => {
    // 将余数加到最后一个测试点
    test.score = index === testCount - 1 
      ? baseScore + remainder 
      : baseScore
  })
}
</script>

<template>
  <div class="bg-white dark:bg-neutral-900">
    <div class="container mx-auto px-4 py-6">
      <!-- 标题栏 -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold flex items-center gap-3">
          <fluent-button appearance="stealth" class="p-1 min-w-0" @click="handleBack">
            <Icon icon="fluent:arrow-left-20-filled" class="w-5 h-5"/>
          </fluent-button>
          创建新题目
        </h1>
        <fluent-button appearance="accent" @click="handleSubmit">
          <Icon icon="fluent:save-20-filled" class="w-5 h-5 mr-2"/>
          保存题目
        </fluent-button>
      </div>

      <!-- 表单内容 -->
      <div class="space-y-8">
        <!-- 基本信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block font-medium text-sm text-neutral-700 dark:text-neutral-300">题目标题</label>
            <fluent-text-input v-model="problem.title" type="text" />
          </div>

          <div class="space-y-2">
            <label class="block font-medium text-sm text-neutral-700 dark:text-neutral-300">难度</label>
            <fluent-menu>
              <fluent-button slot="trigger" appearance="outline" class="w-full justify-between">
                <span>{{ problem.difficulty }}</span>
                <Icon icon="fluent:chevron-down-20-filled" class="w-4 h-4"/>
              </fluent-button>
              <fluent-menu-list>
                <fluent-menu-item v-for="diff in difficulties" :key="diff" @click="problem.difficulty = diff">
                  {{ diff }}
                </fluent-menu-item>
              </fluent-menu-list>
            </fluent-menu>
          </div>

          <div class="space-y-2">
            <label class="block font-medium text-sm text-neutral-700 dark:text-neutral-300">时间限制 (ms)</label>
            <fluent-text-input v-model="problem.timeLimit" type="number" />
          </div>

          <div class="space-y-2">
            <label class="block font-medium text-sm text-neutral-700 dark:text-neutral-300">内存限制 (MB)</label>
            <fluent-text-input v-model="problem.memoryLimit" type="number" />
          </div>
        </div>

        <!-- 标签 -->
        <div class="space-y-4">
          <label class="block font-medium text-neutral-700 dark:text-neutral-300">标签</label>
          <div class="flex gap-2 items-center">
            <fluent-text-input v-model="newTag" class="flex-grow" @keyup.enter="addTag" />
            <fluent-button appearance="accent-outline" @click="addTag">
              <Icon icon="fluent:add-20-filled" class="w-5 h-5"/>
            </fluent-button>
          </div>
          <div class="flex flex-wrap gap-2">
            <fluent-badge v-for="(tag, index) in problem.tags" :key="index"
                         appearance="filled" 
                         class="cursor-pointer h-7 text-sm px-2 rounded-md">
              <div class="flex items-center">
                {{ tag }}
                <Icon icon="fluent:dismiss-20-filled" class="w-3.5 h-3.5 ml-1"/>
              </div>
            </fluent-badge>
          </div>
        </div>

        <!-- 题目描述 -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="block font-medium text-neutral-700 dark:text-neutral-300">题目描述</label>
            <fluent-button class="min-w-[8vw]" appearance="accent-outline" @click="showAIProblemDialog">
              <Icon icon="fluent:bot-20-filled" class="w-5 h-5 mr-2"/>
              AI 生成描述
            </fluent-button>
          </div>
          <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden">
            <div class="dark:invert">
              <Editor :value="problem.content" :plugins="plugins" :locale="zhHans"
                     @change="v => problem.content = v"/>
            </div>
          </div>
        </div>

        <!-- 测试数据 -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="font-medium text-neutral-700 dark:text-neutral-300">测试数据</h2>
            <div class="flex gap-2">
              <fluent-button 
                class="min-w-[8vw]" 
                appearance="outline" 
                @click="autoDistributeScores"
                :disabled="!problem.testCases.length"
              >
                <Icon icon="fluent:number-symbol-20-filled" class="w-5 h-5 mr-2"/>
                均分配分
              </fluent-button>
              <fluent-button class="min-w-[8vw]" appearance="accent-outline" @click="showAITestCaseDialog">
                <Icon icon="fluent:bot-20-filled" class="w-5 h-5 mr-2"/>
                AI 生成测试点
              </fluent-button>
              <fluent-button class="min-w-[8vw]" appearance="accent-outline" @click="addTestCase">
                <Icon icon="fluent:add-20-filled" class="w-5 h-5 mr-2"/>
                添加测试点
              </fluent-button>
            </div>
          </div>
          <div class="space-y-6">
            <div v-for="(test, index) in problem.testCases" :key="index"
                 class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-medium">测试点 #{{ index + 1 }}</h3>
                <div class="flex gap-3 items-center">
                  <div class="space-y-1">
                    <label class="block text-xs text-neutral-600 dark:text-neutral-400">分值</label>
                    <fluent-text-input v-model="test.score" type="number" min="0" max="100" step="5"
                                     class="w-20" />
                  </div>
                  <fluent-button appearance="stealth" @click="removeTestCase(index)">
                    <Icon icon="fluent:delete-20-filled" class="w-5 h-5 text-red-500"/>
                  </fluent-button>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm text-neutral-600 dark:text-neutral-400">输入数据</label>
                  <fluent-textarea block auto-resize v-model="test.input" rows="4" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm text-neutral-600 dark:text-neutral-400">输出数据</label>
                  <fluent-textarea block auto-resize  v-model="test.output" rows="4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 对话框组件 -->
    <AIServiceDialog
      ref="aiProblemDialog"
      :title="aiDialogTitle"
      mode="problem"
      @submit="handleAIProblem"
      @confirm="handleConfirmProblem"
    />
    <AIServiceDialog
      ref="aiTestCaseDialog"
      :title="aiDialogTitle"
      mode="testcase"
      @submit="handleAITestCase"
      @confirm="handleConfirmTestCase"
    />
  </div>
</template>

<style scoped>
:deep(.bytemd) {
  height: 400px;
}
</style>
