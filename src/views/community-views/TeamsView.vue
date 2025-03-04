<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { isLoggedIn } from '@/stores/userStore';

document.title = "Sora Online Judge • 团队";

const router = useRouter();

// 模拟数据
const teams = ref([
  { 
    id: 1, 
    name: '算法竞赛小队', 
    description: '专注于算法竞赛训练和准备的小团队，欢迎有志于参加ACM-ICPC的同学加入！',
    memberCount: 15,
    createdAt: '2023-12-15',
    owner: 'alice',
    isPublic: true
  },
  { 
    id: 2, 
    name: 'ACM集训队', 
    description: '为校ACM竞赛集训队提供题目讨论和解题技巧分享的平台',
    memberCount: 32,
    createdAt: '2023-11-05',
    owner: 'bob',
    isPublic: true
  },
  { 
    id: 3, 
    name: '新手编程学习小组', 
    description: '适合刚开始学习编程的同学，提供基础题目和互助讨论',
    memberCount: 24,
    createdAt: '2024-01-10',
    owner: 'charlie',
    isPublic: true
  },
  { 
    id: 4, 
    name: '研究生算法研讨', 
    description: '面向研究生的高级算法研讨小组，主要讨论前沿算法和竞赛难题',
    memberCount: 8,
    createdAt: '2023-10-20',
    owner: 'dave',
    isPublic: false
  }
]);

const searchKeyword = ref('');
const filterType = ref('all'); // 'all', 'public', 'private'

const filteredTeams = computed(() => {
  let result = teams.value;
  
  // 筛选公开/私密团队
  if (filterType.value === 'public') {
    result = result.filter(team => team.isPublic);
  } else if (filterType.value === 'private') {
    result = result.filter(team => !team.isPublic);
  }
  
  // 搜索关键词
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(team => 
      team.name.toLowerCase().includes(keyword) || 
      team.description.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

const navigateToCreateTeam = () => {
  if (isLoggedIn.value) {
    router.push('/teams/create');
  } else {
    router.push('/login?redirect=' + encodeURIComponent('/teams/create'));
  }
};
</script>

<template>
  <div class="flex flex-col px-6 py-8 max-w-7xl mx-auto">
    <!-- 页面标题和搜索栏 -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-3xl font-bold">团队</h1>
        <p class="text-neutral-600 dark:text-neutral-400 mt-1">加入一个团队，与志同道合的伙伴一起刷题</p>
      </div>
      <div class="flex gap-2">
        <div class="relative">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索团队..."
            class="px-3 py-2 pr-10 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600 w-64"
          />
          <Icon
            icon="fluent:search-20-regular"
            class="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
          />
        </div>
        <fluent-button appearance="accent" @click="navigateToCreateTeam">创建团队</fluent-button>
      </div>
    </div>

    <!-- 过滤选项 -->
    <div class="mb-6">
      <fluent-tabs>
        <fluent-tab id="all-tab" @click="filterType = 'all'" :selected="filterType === 'all'">全部团队</fluent-tab>
        <fluent-tab id="public-tab" @click="filterType = 'public'" :selected="filterType === 'public'">公开团队</fluent-tab>
        <fluent-tab id="private-tab" @click="filterType = 'private'" :selected="filterType === 'private'">私密团队</fluent-tab>
      </fluent-tabs>
    </div>

    <!-- 团队列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <fluent-card
        v-for="team in filteredTeams"
        :key="team.id"
        class="p-6 hover:border-blue-500 transition-colors cursor-pointer"
        @click="router.push(`/teams/${team.id}`)"
      >
        <div class="flex justify-between items-start">
          <h3 class="text-xl font-semibold">{{ team.name }}</h3>
          <span
            v-if="!team.isPublic"
            class="px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
          >
            私密
          </span>
        </div>
        <p class="text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">{{ team.description }}</p>
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-neutral-600 dark:text-neutral-400">
            <span>{{ team.memberCount }} 成员</span>
            <span class="mx-2">•</span>
            <span>创建于 {{ team.createdAt }}</span>
          </div>
          <span
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            @click.stop="router.push(`/profile/${team.owner}`)"
          >
            {{ team.owner }}
          </span>
        </div>
      </fluent-card>
      
      <!-- 创建团队卡片 -->
      <fluent-card 
        class="p-6 border-dashed flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
        @click="navigateToCreateTeam"
      >
        <div class="flex flex-col items-center">
          <Icon icon="fluent:people-team-add-20-filled" class="w-12 h-12 text-neutral-400 dark:text-neutral-600 mb-2" />
          <p class="text-neutral-600 dark:text-neutral-400">创建新团队</p>
        </div>
      </fluent-card>
    </div>
    
    <!-- 无结果提示 -->
    <div v-if="filteredTeams.length === 0" class="flex flex-col items-center justify-center py-16">
      <Icon icon="fluent:people-search-20-regular" class="w-16 h-16 text-neutral-400 dark:text-neutral-600 mb-4" />
      <p class="text-neutral-600 dark:text-neutral-400">没有找到匹配的团队</p>
      <fluent-button appearance="accent" class="mt-4" @click="searchKeyword = ''; filterType = 'all'">
        重置筛选条件
      </fluent-button>
    </div>
  </div>
</template>
