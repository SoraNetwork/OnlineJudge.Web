<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { Viewer } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import math from '@bytemd/plugin-math';
import { isLoggedIn } from '@/stores/userStore';

const route = useRoute();
const router = useRouter();
const postId = route.params.id;

const plugins = [gfm(), highlight(), math()];

// 模拟帖子数据
const post = ref({
  id: postId,
  title: "如何准备程序设计竞赛",
  content: `# 准备竞赛的建议

1. 打好基础
2. 多刷题
3. 参加模拟赛

## 重要知识点
- 数据结构
- 算法设计
- 数学知识`,
  author: "tourist",
  avatar: "",
  time: "2024-01-28 14:30",
  likes: 42,
  isLiked: false,
  tags: ["竞赛", "经验分享"]
});

// 模拟评论数据
const comments = ref([
  {
    id: 1,
    author: "jiangly",
    avatar: "",
    content: "非常实用的建议！",
    time: "2024-01-28 15:00",
    likes: 5
  }
]);

const newComment = ref("");

const handleLike = () => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  post.value.isLiked = !post.value.isLiked;
  post.value.likes += post.value.isLiked ? 1 : -1;
};

const submitComment = () => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  if (!newComment.value.trim()) return;
  
  comments.value.unshift({
    id: comments.value.length + 1,
    author: "当前用户",
    avatar: "",
    content: newComment.value,
    time: new Date().toLocaleString(),
    likes: 0
  });
  newComment.value = "";
};

const getInitials = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

const handleBack = () => {
  router.back();
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 顶部导航 -->
    <div class="flex items-center gap-3 mb-6">
      <fluent-button appearance="stealth" class="p-1 min-w-0" @click="handleBack">
        <Icon icon="fluent:arrow-left-20-filled" class="w-5 h-5"/>
      </fluent-button>
      <h1 class="text-xl font-bold">帖子详情</h1>
    </div>

    <!-- 帖子内容 -->
    <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6 mb-6">
      <!-- 帖子头部 -->
      <div class="flex items-start gap-4 mb-6">
        <div class="w-10 h-10">
          <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-sm font-medium">
            {{ getInitials(post.author) }}
          </fluent-badge>
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-2">{{ post.title }}</h2>
          <div class="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <span>{{ post.author }}</span>
            <span>{{ post.time }}</span>
          </div>
        </div>
      </div>

      <!-- 帖子标签 -->
      <div class="flex gap-2 mb-6">
        <fluent-badge v-for="tag in post.tags" :key="tag" appearance="outline" class="px-2 py-1">
          {{ tag }}
        </fluent-badge>
      </div>

      <!-- 帖子内容 -->
      <div class="prose dark:prose-invert max-w-none mb-6">
        <Viewer :value="post.content" :plugins="plugins" />
      </div>

      <!-- 点赞按钮 -->
      <div class="flex items-center gap-2">
        <fluent-button appearance="outline" @click="handleLike">
          <Icon :icon="post.isLiked ? 'fluent:thumb-like-20-filled' : 'fluent:thumb-like-20-regular'" 
                class="w-5 h-5 mr-2" />
          {{ post.likes }}
        </fluent-button>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
      <h3 class="text-lg font-bold mb-4">评论 ({{ comments.length }})</h3>
      
      <!-- 评论输入框 -->
      <div class="mb-6">
        <fluent-text-area
          v-model="newComment"
          placeholder="写下你的评论..."
          resize="vertical"
          appearance="outline"
          class="w-full mb-2"
        />
        <div class="flex justify-end">
          <fluent-button appearance="accent" @click="submitComment">
            发表评论
          </fluent-button>
        </div>
      </div>

      <!-- 评论列表 -->
      <div class="space-y-4">
        <div v-for="comment in comments" :key="comment.id" 
             class="p-4 rounded-lg border-1 border-neutral-200 dark:border-neutral-700">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8">
              <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-sm font-medium">
                {{ getInitials(comment.author) }}
              </fluent-badge>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">{{ comment.author }}</span>
                <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ comment.time }}</span>
              </div>
              <p class="text-neutral-800 dark:text-neutral-200">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  max-width: none;
}
</style>
