<script setup>
import { ref } from 'vue';
import { Editor } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import breaks from '@bytemd/plugin-breaks';
import frontmatter from '@bytemd/plugin-frontmatter';
import math from '@bytemd/plugin-math';
import zhHans from 'bytemd/lib/locales/zh_Hans.json';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref('');
const content = ref('');
const selectedTags = ref(['','']);
const isPublishing = ref(false);

// ByteMD 插件配置
const plugins = [
  gfm(),
  highlight(),
  breaks(),
  frontmatter(),
  math()
];

// 可选标签列表
const availableTags = [
  '讨论', '提问', '分享', '经验', '比赛', '题解'
];

const handlePublish = async () => {
  if (!title.value.trim()) {
    alert('请输入标题');
    return;
  }
  if (!content.value.trim()) {
    alert('请输入内容');
    return;
  }
  
  isPublishing.value = true;
  try {
    // TODO: 调用发布API
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
    router.push('/community');
  } catch (error) {
    console.error(error);
    alert('发布失败');
  } finally {
    isPublishing.value = false;
  }
};

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

const handleBack = () => {
  router.back();
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 顶部导航 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <fluent-button appearance="stealth" class="p-1 min-w-0" @click="handleBack">
          <Icon icon="fluent:arrow-left-20-filled" class="w-5 h-5"/>
        </fluent-button>
        <h1 class="text-2xl font-bold">发布帖子</h1>
      </div>
      <fluent-button appearance="accent" :disabled="isPublishing" @click="handlePublish">
        <Icon icon="fluent:send-20-filled" class="w-5 h-5 mr-2"/>
        {{ isPublishing ? '发布中...' : '发布' }}
      </fluent-button>
    </div>

    <!-- 标题输入 -->
    <div class="mb-6">
      <fluent-text-field
        v-model="title"
        placeholder="请输入标题"
        class="w-full text-xl"
        appearance="outline"
      />
    </div>

    <!-- 标签选择 -->
    <div class="mb-6 flex flex-wrap gap-2">
      <fluent-badge
        v-for="tag in availableTags"
        :key="tag"
        :appearance="selectedTags.includes(tag) ? 'accent' : 'outline'"
        class="cursor-pointer px-3 py-1"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </fluent-badge>
    </div>

    <!-- Markdown 编辑器 -->
    <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
      <div class="min-h-[500px] w-full">
        <div class="dark:invert">
          <Editor
            :value="content"
            :plugins="plugins"
            :locale="zhHans"
            @change="content = $event"
            placeholder="在这里输入帖子内容..."
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fluent-text-field {
  --fds-text-field-size: 48px;
}
</style>
