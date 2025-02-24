<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { isLoggedIn } from '@/stores/userStore';

document.title = "Sora Online Judge • 社区";

const router = useRouter();

// 模拟团队数据
const myTeams = ref([
  { id: 1, name: "ACM 校队", members: 25, description: "校 ACM 竞赛队" },
  { id: 2, name: "算法学习小组", members: 15, description: "每周算法研讨" },
]);

// 模拟帖子数据
const posts = ref([
  {
    id: 1,
    title: "如何准备程序设计竞赛",
    author: "tourist",
    avatar: "",
    time: "2024-01-28 14:30",
    likes: 42,
    comments: 15,
    tags: ["竞赛", "经验分享"]
  },
  {
    id: 2,
    title: "动态规划解题技巧总结",
    author: "jiangly",
    avatar: "",
    time: "2024-01-27 16:20",
    likes: 38,
    comments: 12,
    tags: ["算法", "动态规划"]
  }
]);

const createPost = () => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  router.push('/community/new-post');
};

// 获取用户名首字母
const getInitials = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};
</script>

<template>
  <div class="flex flex-col p-8 gap-6">
    <!-- 顶部操作栏 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">社区</h1>
      <fluent-button appearance="accent" @click="createPost">
        <Icon icon="fluent:add-20-filled" class="w-5 h-5 mr-2" />
        发布帖子
      </fluent-button>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- 左侧：我的团队 -->
      <div class="md:w-1/3">
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">我的团队</h2>
            <a class="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline text-sm">查看全部</a>
          </div>
          
          <div class="flex flex-col gap-4">
            <div v-for="team in myTeams" :key="team.id"
              class="p-4 rounded-lg border-1 border-neutral-200 dark:border-neutral-700 hover:border-blue-500 cursor-pointer transition-colors">
              <div class="flex justify-between items-start">
                <h3 class="font-medium">{{ team.name }}</h3>
                <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ team.members }} 成员</span>
              </div>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{{ team.description }}</p>
            </div>

            <fluent-button appearance="outline" class="w-full">
              <Icon icon="fluent:people-team-add-20-regular" class="w-5 h-5 mr-2" />
              创建团队
            </fluent-button>
          </div>
        </div>
      </div>

      <!-- 右侧：帖子列表 -->
      <div class="md:w-2/3">
        <div class="flex flex-col gap-4">
          <!-- 筛选器 -->
          <div class="flex gap-4 mb-2">
            <fluent-button appearance="outline">
              最新发布
              <Icon icon="fluent:arrow-sort-down-20-filled" class="w-5 h-5 ml-2" />
            </fluent-button>
            <fluent-button appearance="outline">
              标签筛选
              <Icon icon="fluent:tag-20-regular" class="w-5 h-5 ml-2" />
            </fluent-button>
          </div>

          <!-- 帖子列表 -->
          <div v-for="post in posts" :key="post.id"
            class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6 cursor-pointer hover:border-blue-500 transition-colors">
            <div class="flex items-start gap-4">
              <!-- 作者头像 -->
              <div class="w-10 h-10">
                <div v-if="post.avatar" class="w-full h-full">
                  <fluent-avatar :image="post.avatar" :title="post.author" />
                </div>
                <div v-else class="w-full h-full">
                  <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-sm font-medium">
                    {{ getInitials(post.author) }}
                  </fluent-badge>
                </div>
              </div>

              <div class="flex-1">
                <!-- 帖子标题和作者信息 -->
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400">{{ post.title }}</h3>
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ post.time }}</span>
                </div>
                <div class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{{ post.author }}</div>

                <!-- 标签 -->
                <div class="flex gap-2 mt-3">
                  <fluent-badge v-for="tag in post.tags" :key="tag" appearance="outline" class="px-2 py-1">
                    {{ tag }}
                  </fluent-badge>
                </div>

                <!-- 互动统计 -->
                <div class="flex gap-4 mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <span class="flex items-center gap-1">
                    <Icon icon="fluent:thumb-like-20-regular" />
                    {{ post.likes }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon icon="fluent:comment-20-regular" />
                    {{ post.comments }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
