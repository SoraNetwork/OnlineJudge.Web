<script setup>
import { ref, computed, onMounted } from 'vue'
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
import { createQuestion, generateQuestionByAI, generateTestcasesByAI } from '@/api/questionApi'
import { message } from '@/services/MessageService' // 导入消息服务

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
  visibility: 'private', // 添加可见性属性
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

// 添加用户信息引用
const currentUser = ref({
  username: '',
  teams: []
})

// 修改可见性选项为计算属性
const visibilities = computed(() => [
  { value: 'public', label: '公开', description: '所有用户可见' },
  { value: 'contest', label: '比赛专用', description: '仅在比赛中可见' },
  ...currentUser.value.teams.map(team => ({ 
    value: `team.${team.id}`, 
    label: `团队: ${team.name}`, 
    description: `仅对"${team.name}"团队成员可见`
  })),
  { 
    value: `private.${currentUser.value.username}`, 
    label: `私有`, 
    description: `仅对您(${currentUser.value.username})可见` 
  }
])

// 在组件挂载时获取当前用户信息
onMounted(async () => {
  try {
    // 这里应该调用获取用户信息的API
    // 模拟数据，实际开发时请替换为真实API调用
    currentUser.value = {
      username: 'current_user', // 应从API获取
      teams: [
        { id: 'team1', name: '算法竞赛队' },
        { id: 'team2', name: '课程小组' }
      ] // 应从API获取
    }
    
    // 设置默认可见性为私有
    problem.value.visibility = `private.${currentUser.value.username}`
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})

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

const addTestCase = () => {
  problem.value.testCases.push({ input: '', output: '', score: 10 })
  message.info('已添加一个新测试点')
}

const removeTestCase = (index) => {
  problem.value.testCases.splice(index, 1)
  message.info('已删除测试点')
}

// 添加加载状态
const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    // 表单验证
    if (!problem.value.title) {
      message.error('请输入题目标题')
      return
    }
    
    if (!problem.value.content) {
      message.error('请输入题目描述')
      return
    }
    
    if (problem.value.testCases.length === 0) {
      message.error('请至少添加一个测试点')
      return
    }
    
    // 检查测试点是否都已填写
    const emptyTestCase = problem.value.testCases.find(tc => !tc.input || !tc.output)
    if (emptyTestCase) {
      message.error('所有测试点的输入和输出不能为空')
      return
    }
    
    // 将表单数据转换为API请求格式
    const request = {
      difficulty: problem.value.difficulty,
      title: problem.value.title,
      description: problem.value.content,
      checkpoints: problem.value.testCases.map(testCase => ({
        input: testCase.input,
        output: testCase.output,
        score: testCase.score
      })),
      visibility: [problem.value.visibility], // 后端API需要数组格式的visibility
      tags: problem.value.tags
    }
    
    // 开始加载
    isLoading.value = true
    
    // 调用创建题目API
    const response = await createQuestion(request)
    
    if (response.success) {
      message.success('题目创建成功！')
      router.push('/questions')
    } else {
      message.error(`创建失败: ${response.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('提交题目时出错:', error)
    message.error(`创建失败: ${error.message || '未知错误'}`)
  } finally {
    // 结束加载
    isLoading.value = false
  }
}

const handleBack = () => {
  router.back()
}

// AI 对话框引用
const aiProblemDialog = ref(null)
const aiTestCaseDialog = ref(null)

// AI 对话框标题
const aiDialogTitle = ref('')

// 使用AI生成题目描述
const handleAIProblem = async (prompt) => {
  try {
    message.info('AI 正在生成题目描述...')
    
    const response = await generateQuestionByAI({
      description: prompt
    })
    
    if (response.success) {
      message.success('AI 已生成题目描述')
      return response.data
    } else {
      throw new Error(response.message || '生成题目描述失败')
    }
  } catch (error) {
    console.error('生成题目失败:', error)
    message.error('生成题目失败，请稍后重试')
    throw error
  }
}

// 确认使用生成的题目描述
const handleConfirmProblem = (content) => {
  problem.value.content = content
  message.success('已应用 AI 生成的题目描述')
}

// 检查题目描述是否是默认模板
const isDefaultContent = () => {
  const defaultContent = `## 问题描述

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

可以在这里添加一些解题提示或说明...`;

  return problem.value.content === defaultContent || 
         problem.value.content.includes('请在这里描述题目的具体要求') ||
         problem.value.content.includes('请描述输入数据的格式') ||
         problem.value.content.includes('在这里给出具体的输入样例');
}

// 使用AI生成测试点
const handleAITestCase = async (prompt) => {
  try {
    // 检查题目是否仍是默认内容
    if (isDefaultContent()) {
      message.warning('请先编辑题目描述后再生成测试点')
      return null
    }
    
    // 显示加载消息
    message.info('AI 正在生成测试用例...')
    
    // 调用AI生成测试用例API
    const response = await generateTestcasesByAI({
      title: problem.value.title,
      description: problem.value.content + '\n\n用户提示: ' + prompt,
      testCaseCount: 5 // 默认生成5个测试用例
    })
    
    if (response.success) {
      message.success('AI 已生成测试用例')
      // 解析返回的JSON字符串
      const testCaseData = JSON.parse(response.data)
      
      // 将API返回的数据转换为组件需要的格式
      return testCaseData.testCases.map((tc, index) => ({
        input: tc.input,
        output: tc.expectedOutput,
        score: Math.floor(100 / testCaseData.testCases.length) // 平均分配分数
      }))
    } else {
      throw new Error(response.message || '生成测试用例失败')
    }
  } catch (error) {
    console.error('生成测试点失败:', error)
    message.error('生成测试点失败，请稍后重试')
    throw error
  }
}

// 确认使用生成的测试点
const handleConfirmTestCase = (testCases) => {
  problem.value.testCases.push(...testCases)
  message.success(`已添加 ${testCases.length} 个测试点`)
}

// 显示 AI 题目生成对话框
const showAIProblemDialog = () => {
  aiDialogTitle.value = 'AI 生成题目描述'
  aiProblemDialog.value?.show()
}

// 显示 AI 测试点生成对话框
const showAITestCaseDialog = () => {
  // 先检查题目内容是否是默认模板
  if (isDefaultContent()) {
    message.warning('请先编辑题目描述后再生成测试点')
    return
  }
  
  aiDialogTitle.value = 'AI 生成测试点'
  // 传递题目标题和内容给对话框组件
  aiTestCaseDialog.value?.show({
    title: problem.value.title,
    description: problem.value.content
  })
}

// 自动分配测试点分数
const autoDistributeScores = () => {
  const testCount = problem.value.testCases.length
  if (testCount === 0) {
    message.warning('没有测试点可以分配分数')
    return
  }
  
  const baseScore = Math.floor(100 / testCount)
  const remainder = 100 - (baseScore * testCount)
  
  problem.value.testCases.forEach((test, index) => {
    // 将余数加到最后一个测试点
    test.score = index === testCount - 1 
      ? baseScore + remainder 
      : baseScore
  })
  
  message.success('已均分配分，总分为100分')
}

// 添加菜单状态控制
const isDifficultyMenuOpen = ref(false)
const isVisibilityMenuOpen = ref(false)

// 添加切换菜单方法
const toggleMenu = (menu) => {
  switch (menu) {
    case 'difficulty':
      isDifficultyMenuOpen.value = !isDifficultyMenuOpen.value
      isVisibilityMenuOpen.value = false
      break
    case 'visibility':
      isVisibilityMenuOpen.value = !isVisibilityMenuOpen.value
      isDifficultyMenuOpen.value = false
      break
  }
}

// 添加关闭所有菜单方法
const closeAllMenus = () => {
  isDifficultyMenuOpen.value = false
  isVisibilityMenuOpen.value = false
}
</script>

<template>
  <div class="bg-white dark:bg-neutral-900" @click="closeAllMenus">
    <div class="container mx-auto px-4 py-6">
      <!-- 标题栏 -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold flex items-center gap-3">
          <fluent-button appearance="stealth" class="p-1 min-w-0" @click="handleBack">
            <Icon icon="fluent:arrow-left-20-filled" class="w-5 h-5"/>
          </fluent-button>
          创建新题目
        </h1>
        <fluent-button appearance="accent" @click="handleSubmit" :disabled="isLoading">
          <Icon v-if="isLoading" icon="fluent:spinner-ios-20-regular" class="w-5 h-5 mr-2 animate-spin"/>
          <Icon v-else icon="fluent:save-20-filled" class="w-5 h-5 mr-2"/>
          {{ isLoading ? '保存中...' : '保存题目' }}
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
            <div class="relative" @click.stop>
              <button
                @click="toggleMenu('difficulty')"
                class="min-w-32 px-3 py-1.5 rounded-sm transition flex items-center justify-between bg-transparent dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                <span>{{ problem.difficulty }}</span>
                <Icon icon="fluent:chevron-down-20-filled" 
                      class="w-4 h-4 ml-2 transition-transform"
                      :class="{ 'rotate-180': isDifficultyMenuOpen }" />
              </button>
              <div v-show="isDifficultyMenuOpen"
                   class="absolute z-50 min-w-32 mt-2 rounded-md shadow-lg origin-top-right transition-all">
                <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 backdrop-blur-md bg-neutral-100/95 dark:bg-neutral-800/95">
                  <button
                    v-for="diff in difficulties"
                    :key="diff"
                    @click="problem.difficulty = diff; isDifficultyMenuOpen = false"
                    class="block min-w-32 text-left px-4 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    :class="{ 'bg-neutral-200 dark:bg-neutral-700': problem.difficulty === diff }"
                  >
                    {{ diff }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block font-medium text-sm text-neutral-700 dark:text-neutral-300">时间限制 (ms)</label>
            <fluent-text-input v-model="problem.timeLimit" type="number" />
          </div>

          <div class="space-y-2">
            <label class="block font-medium text-sm text-neutral-700 dark:text-neutral-300">内存限制 (MB)</label>
            <fluent-text-input v-model="problem.memoryLimit" type="number" />
          </div>

          <!-- 在难度选择后添加可见性设置 -->
          <div class="space-y-2">
            <label class="block font-medium text-sm text-neutral-700 dark:text-neutral-300">可见性</label>
            <div class="relative" @click.stop>
              <button
                @click="toggleMenu('visibility')"
                class="min-w-32 w-[65%] px-3 py-1.5 rounded-sm transition flex items-center justify-between bg-transparent dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                <span>{{ visibilities.find(v => v.value === problem.visibility)?.label || '私有' }}</span>
                <Icon icon="fluent:chevron-down-20-filled" 
                      class="w-4 h-4 ml-2 transition-transform"
                      :class="{ 'rotate-180': isVisibilityMenuOpen }" />
              </button>
              <div v-show="isVisibilityMenuOpen"
                   class="absolute z-50 w-[65%] mt-2 rounded-md shadow-lg origin-top-right transition-all">
                <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 backdrop-blur-md bg-neutral-100/95 dark:bg-neutral-800/95">
                  <button
                    v-for="vis in visibilities"
                    :key="vis.value"
                    @click="problem.visibility = vis.value; isVisibilityMenuOpen = false"
                    class="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    :class="{ 'bg-neutral-200 dark:bg-neutral-700': problem.visibility === vis.value }"
                  >
                    <div class="flex flex-col">
                      <span>{{ vis.label }}</span>
                      <span class="text-xs text-neutral-500 dark:text-neutral-400">{{ vis.description }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
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
