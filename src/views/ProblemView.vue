<script setup lang="ts">
import type { Editor, Viewer } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import breaks from '@bytemd/plugin-breaks';
import frontmatter from '@bytemd/plugin-frontmatter';
import math from '@bytemd/plugin-math';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import TokenItem from '@/components/TokenItem.vue';

const route = useRoute();
const problemId = route.params.id;

const plugins = [
  gfm(),
  highlight(),
  breaks(),
  frontmatter(),
  math()
];

const problem = ref({
  id: 'P1001',
  title: 'A + B Problem',
  difficulty: '入门',
  timeLimit: 1000,
  memoryLimit: 256,
  tags: ['数学', '模拟'],
  acceptance: '95%',
  content: `# A + B Problem

## 问题描述

给定两个整数 A 和 B，请你计算它们的和。

## 输入格式

输入包含一行，包含两个整数 A 和 B。

## 输出格式

输出一行，包含一个整数，表示 A + B 的值。

## 样例输入

\`\`\`
1 2
\`\`\`

## 样例输出

\`\`\`
3
\`\`\`

## 数据范围

- 1 ≤ A, B ≤ 1000

## 提示

这是一个简单的入门题目，帮助你熟悉提交程序的流程。`
});

const isEditing = ref(false);
const editedContent = ref('');

onMounted(() => {
  // 这里应该从API获取题目数据
  editedContent.value = problem.value.content;
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
  // 处理提交代码逻辑
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex flex-col gap-6">
      <!-- 标题栏 -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold flex items-center gap-3">
            {{ problem.id }}. {{ problem.title }}
            <TokenItem :Token="problem.difficulty" Glyph="fluent:target-20-filled"/>
          </h1>
          <div class="mt-2 flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
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

      <!-- 标签 -->
      <div class="flex gap-2">
        <TokenItem v-for="tag in problem.tags" :key="tag" :Token="tag" Glyph="fluent:tag-20-filled"/>
      </div>

      <!-- 内容区域 -->
      <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
        <div v-if="isEditing" class="min-h-[500px]">
          <Editor
            :value="editedContent"
            :plugins="plugins"
            @update:value="editedContent = $event"
          />
        </div>
        <div v-else class="p-6">
          <Viewer
            :value="problem.content"
            :plugins="plugins"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import 'bytemd/dist/index.css';
@import 'highlight.js/styles/github-dark.css';
@import 'katex/dist/katex.css';

.bytemd {
  background-color: transparent;
}

.markdown-body {
  background-color: transparent !important;
}

.dark .markdown-body {
  color: #e5e5e5;
}

.dark .bytemd-toolbar {
  background-color: #262626;
  border-color: #404040;
}

.dark .bytemd-status {
  background-color: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .bytemd-editor {
  background-color: #262626;
  color: #e5e5e5;
}
</style>
