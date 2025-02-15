<script setup lang="js">

import { Editor } from '@bytemd/vue-next'
import { Viewer } from '@bytemd/vue-next'
import 'bytemd/dist/index.css'
import {  ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import TokenItem from '@/components/TokenItem.vue'
import router from '@/router'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import math from '@bytemd/plugin-math'
import zhHans from 'bytemd/lib/locales/zh_Hans.json'


const route = useRoute();
const problemId = route.params.id;

const problem = ref({
  id: 'P1001',
  title: 'A + B Problem',
  difficulty: '入门',
  timeLimit: 1000,
  memoryLimit: 256,
  tags: ['数学', '模拟'],
  acceptance: '95%',
  content: `## 问题描述

---

给定两个整数 A 和 B，请你计算它们的和。

## 输入格式

---

输入包含一行，包含两个整数 A 和 B。

## 输出格式

---

输出一行，包含一个整数，表示 A + B 的值。

## 样例输入

---

\`\`\`
1 2
\`\`\`

## 样例输出

---

\`\`\`
3
\`\`\`

## 数据范围

---

- 1 ≤ A, B ≤ 1000

## 提示

---

这是一个简单的入门题目，帮助你熟悉提交程序的流程。`
});

const isEditing = ref(false);
const editedContent = ref('');
const isLoading = ref(true);

// 修改提交记录数据结构，添加用户标识
const recentSubmissions = ref({
  personalSubmissions: [], // 个人提交记录为空
  otherSubmissions: [     // 他人提交记录
    {
      id: '12345',
      status: 'Accepted',
      time: '100ms',
      memory: '10.5MB',
      language: 'C++',
      submitTime: '2024-01-20 12:30:45',
      username: 'user1'
    },
    {
      id: '12344',
      status: 'Wrong Answer',
      time: '95ms',
      memory: '10.2MB',
      language: 'Python',
      submitTime: '2024-01-20 12:25:30',
      username: 'user2'
    }
  ]
});

// 计算要显示的提交记录
const displaySubmissions = computed(() => {
  return recentSubmissions.value.personalSubmissions.length > 0 
    ? recentSubmissions.value.personalSubmissions 
    : recentSubmissions.value.otherSubmissions;
});

onMounted(async () => {
  try {
    // 模拟API加载
    await new Promise(resolve => setTimeout(resolve, 1000));
    editedContent.value = problem.value.content;
  } finally {
    isLoading.value = false;
  }
});

const handleEdit = () => {
  isEditing.value = true;
};

const handleSave = () => {
  problem.value.content = editedContent.value;
  isEditing.value = false;
  // 这里应该调用API保存更改
};

const handleSubmit = () => {
  router.push(`/questions/${problemId}/submit`);
};

const handleEditorChange = (v) => {
  editedContent.value = v;
};
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-neutral-900">
    <div class="container mx-auto px-4 py-6">
      <div v-if="isLoading" class="flex justify-center min-h-[200px] w-full">
        <fluent-progress-bar indeterminate></fluent-progress-bar>
      </div>
      
      <template v-else>
        <!-- 标题栏 -->
        <div class="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-3">
              {{ problem.id }}. {{ problem.title }}
              <TokenItem :Token="problem.difficulty" Glyph="fluent:target-20-filled"/>
            </h1>
            <div class="mt-2 flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
              <span>时间限制: {{ problem.timeLimit }}ms</span>
              <span>内存限制: {{ problem.memoryLimit }}MB</span>
              <span>通过率: {{ problem.acceptance }}</span>
            </div>
          </div>
          <div class="flex gap-3">
            <fluent-button v-if="isEditing" appearance="accent" @click="handleSave">
              <Icon icon="fluent:save-20-filled" class="w-5 h-5 mr-2"/>
              保存
            </fluent-button>
            <fluent-button v-else appearance="outline" @click="handleEdit">
              <Icon icon="fluent:edit-20-filled" class="w-5 h-5 mr-2"/>
              编辑
            </fluent-button>
            <fluent-button appearance="accent" @click="handleSubmit">
              <Icon icon="fluent:send-20-filled" class="w-5 h-5 mr-2"/>
              提交
            </fluent-button>
          </div>
        </div>

        <!-- 主要内容区域 - 使用网格布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- 左侧题目内容 -->
          <div :class="{'lg:col-span-3': !isEditing, 'lg:col-span-4': isEditing}">
            <div class="flex gap-2 mb-4">
              <TokenItem v-for="tag in problem.tags" :key="tag" :Token="tag" Glyph="fluent:tag-20-filled"/>
            </div>

            <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
              <div v-if="isEditing" class="min-h-[500px] w-full">
                <div class="dark:invert">
                  <Editor
                    :value="editedContent"
                    :plugins="plugins"
                    :locale="zhHans"
                    @change="handleEditorChange"
                    class="w-full"
                  />
                </div>
              </div>
              <div v-else class="p-6 markdown-body custom-markdown">
                <Viewer
                  :value="problem.content"
                  :plugins="plugins"
                />
              </div>
            </div>
          </div>

          <!-- 右侧提交记录 - 仅在非编辑模式显示 -->
          <div v-if="!isEditing" class="lg:col-span-1">
            <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-4">
              <h2 class="text-lg font-semibold mb-4">
                {{ recentSubmissions.personalSubmissions.length > 0 ? '我的提交' : '最近提交' }}
              </h2>
              <div class="flex flex-col gap-3">
                <div v-for="submission in displaySubmissions" 
                     :key="submission.id"
                     class="p-3 bg-white dark:bg-neutral-700 rounded-lg">
                  <div class="flex items-center gap-2">
                    <TokenItem :Token="submission.status" 
                             :Glyph="submission.status === 'Accepted' ? 'fluent:checkmark-20-filled' : 'fluent:dismiss-20-filled'"/>
                    <span v-if="recentSubmissions.personalSubmissions.length === 0" 
                          class="text-sm text-neutral-600 dark:text-neutral-400">
                      {{ submission.username }}
                    </span>
                  </div>
                  <div class="text-sm text-neutral-600 dark:text-neutral-400">
                    <div>{{ submission.submitTime }}</div>
                    <div>语言：{{ submission.language }}</div>
                    <div>耗时：{{ submission.time }}</div>
                    <div>内存：{{ submission.memory }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>


<script lang="js">
const plugins=[
  gfm(),
  highlight(),
  breaks(),
  frontmatter(),
  math()
];

export default {
  components: { Editor , Viewer},
  data() {
    return { value: '', plugins }
  },
  methods: {
    handleChange(v) {
      this.value = v
    },
  },
}
</script>

<style>
.custom-markdown {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.custom-markdown h2 {
  font-weight: 600;
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.custom-markdown code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.custom-markdown table {
  width: 100%;
  margin: 1rem 0;
}

.custom-markdown td, .custom-markdown th {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
}

.dark .custom-markdown td, .dark .custom-markdown th {
  border-color: #374151;
}
</style>