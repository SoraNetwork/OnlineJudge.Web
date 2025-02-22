<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from "@iconify/vue";
import router from '@/router';

document.title = "Sora Online Judge • 比赛";

interface Contest {
  id: number;
  title: string;
  description: string;
  startTime: string;
  duration: string;
  participants: number;
  status: '即将开始' | '进行中' | '已结束';
  type: '公开赛' | '私有赛' | '练习赛';
  difficulty: '入门' | '简单' | '中等' | '困难';
}

const contests = ref<Contest[]>([
  {
    id: 1,
    title: "SOJ 周赛 #1",
    description: "每周例行算法练习赛，适合新手参与",
    startTime: "2024-02-01 14:00",
    duration: "2小时",
    participants: 128,
    status: "即将开始",
    type: "公开赛",
    difficulty: "简单"
  },
  {
    id: 2,
    title: "2024 寒假集训营",
    description: "为在校学生提供的算法训练营",
    startTime: "2024-01-25 09:00",
    duration: "7天",
    participants: 256,
    status: "已结束",
    type: "私有赛",
    difficulty: "中等"
  },
  {
    id: 3,
    title: "SOJ 月赛 #12",
    description: "月度大型竞赛，题目难度适中",
    startTime: "2024-02-15 10:00",
    duration: "4小时",
    participants: 512,
    status: "即将开始",
    type: "公开赛",
    difficulty: "中等"
  },
  {
    id: 4,
    title: "算法进阶训练赛",
    description: "针对有竞赛经验的选手设计的高强度训练",
    startTime: "2024-02-10 13:00",
    duration: "5小时",
    participants: 89,
    status: "即将开始",
    type: "练习赛",
    difficulty: "困难"
  },
  {
    id: 5,
    title: "新手入门赛 #3",
    description: "专为编程新手打造的友好竞赛环境",
    startTime: "2024-02-03 09:30",
    duration: "3小时",
    participants: 320,
    status: "即将开始",
    type: "练习赛",
    difficulty: "入门"
  }
]);

const filterStatus = ref<string>('全部');
const filterType = ref<string>('全部');
const sortBy = ref<string>('最新');

const filteredContests = computed(() => {
  let result = [...contests.value];
  
  if (filterStatus.value !== '全部') {
    result = result.filter(contest => contest.status === filterStatus.value);
  }
  
  if (filterType.value !== '全部') {
    result = result.filter(contest => contest.type === filterType.value);
  }
  
  // 排序
  if (sortBy.value === '最新') {
    result.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  } else if (sortBy.value === '参与人数') {
    result.sort((a, b) => b.participants - a.participants);
  }
  
  return result;
});

const getStatusColor = (status: string) => {
  switch (status) {
    case '即将开始': return 'text-blue-600 dark:text-blue-400';
    case '进行中': return 'text-green-600 dark:text-green-400';
    case '已结束': return 'text-neutral-600 dark:text-neutral-400';
    default: return '';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case '入门': return 'text-green-600 dark:text-green-400';
    case '简单': return 'text-blue-600 dark:text-blue-400';
    case '中等': return 'text-yellow-600 dark:text-yellow-400';
    case '困难': return 'text-red-600 dark:text-red-400';
    default: return '';
  }
};

const isStatusMenuOpen = ref(false);
const isTypeMenuOpen = ref(false);
const isSortMenuOpen = ref(false);

const toggleMenu = (menu: 'status' | 'type' | 'sort') => {
  switch (menu) {
    case 'status':
      isStatusMenuOpen.value = !isStatusMenuOpen.value;
      isTypeMenuOpen.value = false;
      isSortMenuOpen.value = false;
      break;
    case 'type':
      isTypeMenuOpen.value = !isTypeMenuOpen.value;
      isStatusMenuOpen.value = false;
      isSortMenuOpen.value = false;
      break;
    case 'sort':
      isSortMenuOpen.value = !isSortMenuOpen.value;
      isStatusMenuOpen.value = false;
      isTypeMenuOpen.value = false;
      break;
  }
};

// 点击外部关闭菜单
const closeAllMenus = () => {
  isStatusMenuOpen.value = false;
  isTypeMenuOpen.value = false;
  isSortMenuOpen.value = false;
};

function navigate(path: string) {
  window.scrollTo(0, 0);
  router.push(path);
}
</script>

<template>
  <div class="min-h-[95vh] w-full bg-neutral-100 dark:bg-neutral-900" @click="closeAllMenus">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <!-- 标题部分 -->
      <div class="mb-6 lg:mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold mb-2">竞赛</h1>
        <p class="text-neutral-600 dark:text-neutral-400">
          参加编程竞赛，提升你的算法实力
        </p>
      </div>

      <!-- 筛选和排序工具栏 -->
      <div class="flex flex-wrap gap-3 mb-6">
        <!-- 状态筛选 -->
        <div class="relative" @click.stop>
          <button
            @click="toggleMenu('status')"
            class="min-w-32 px-3 py-1.5 rounded-sm transition flex items-center justify-between bg-transparent dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <span>{{ filterStatus === '全部' ? '全部状态' : filterStatus }}</span>
            <Icon icon="fluent:chevron-down-20-regular" 
                  class="w-4 h-4 ml-2 transition-transform" 
                  :class="{ 'rotate-180': isStatusMenuOpen }" />
          </button>
          <div v-show="isStatusMenuOpen"
               class="absolute z-50 min-w-full mt-2 rounded-md shadow-lg origin-top-right transition-all">
            <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 backdrop-blur-md bg-neutral-100/95 dark:bg-neutral-800/95">
              <button
                v-for="status in ['全部', '即将开始', '进行中', '已结束']"
                :key="status"
                @click="filterStatus = status; isStatusMenuOpen = false"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-200 dark:bg-neutral-700': filterStatus === status }"
              >
                {{ status === '全部' ? '全部状态' : status }}
              </button>
            </div>
          </div>
        </div>

        <!-- 类型筛选 -->
        <div class="relative" @click.stop>
          <button
            @click="toggleMenu('type')"
            class="min-w-32 px-3 py-1.5 rounded-sm transition flex items-center justify-between bg-transparent dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <span>{{ filterType === '全部' ? '全部类型' : filterType }}</span>
            <Icon icon="fluent:chevron-down-20-regular" 
                  class="w-4 h-4 ml-2 transition-transform"
                  :class="{ 'rotate-180': isTypeMenuOpen }" />
          </button>
          <div v-show="isTypeMenuOpen"
               class="absolute z-50 min-w-full mt-2 rounded-md shadow-lg origin-top-right transition-all">
            <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 backdrop-blur-md bg-neutral-100/95 dark:bg-neutral-800/95">
              <button
                v-for="type in ['全部', '公开赛', '私有赛', '练习赛']"
                :key="type"
                @click="filterType = type; isTypeMenuOpen = false"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-200 dark:bg-neutral-700': filterType === type }"
              >
                {{ type === '全部' ? '全部类型' : type }}
              </button>
            </div>
          </div>
        </div>

        <!-- 排序选项 -->
        <div class="relative" @click.stop>
          <button
            @click="toggleMenu('sort')"
            class="min-w-32 px-3 py-1.5 rounded-sm transition flex items-center justify-between bg-transparent dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <span>{{ sortBy }}</span>
            <Icon icon="fluent:chevron-down-20-regular" 
                  class="w-4 h-4 ml-2 transition-transform"
                  :class="{ 'rotate-180': isSortMenuOpen }" />
          </button>
          <div v-show="isSortMenuOpen"
               class="absolute z-50 min-w-full mt-2 rounded-md shadow-lg origin-top-right transition-all">
            <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 backdrop-blur-md bg-neutral-100/95 dark:bg-neutral-800/95">
              <button
                v-for="option in ['最新', '参与人数']"
                :key="option"
                @click="sortBy = option; isSortMenuOpen = false"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-200 dark:bg-neutral-700': sortBy === option }"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 竞赛列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <div v-for="contest in filteredContests" :key="contest.id"
          @click="navigate(`contests/${contest.id}`)"
          class="bg-neutral-50 dark:bg-neutral-800 rounded-lg border-1 border-neutral-200 dark:border-neutral-700 p-6 hover:border-blue-500 transition-colors cursor-pointer group">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ contest.title }}
            </h3>
            <span :class="getStatusColor(contest.status)" class="text-sm font-medium">
              {{ contest.status }}
            </span>
          </div>
          
          <p class="text-neutral-600 dark:text-neutral-400 mb-4">
            {{ contest.description }}
          </p>
          
          <div class="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <div class="flex items-center gap-1">
              <Icon icon="fluent:calendar-20-regular" class="w-4 h-4" />
              <span>{{ contest.startTime }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon icon="fluent:timer-20-regular" class="w-4 h-4" />
              <span>{{ contest.duration }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon icon="fluent:people-20-regular" class="w-4 h-4" />
              <span>{{ contest.participants }}人参与</span>
            </div>
          </div>

          <div class="flex gap-2 mt-4">
            <span class="px-2 py-1 text-sm rounded-full bg-neutral-200 dark:bg-neutral-700">
              {{ contest.type }}
            </span>
            <span :class="[
              'px-2 py-1 text-sm rounded-full',
              getDifficultyColor(contest.difficulty),
              'bg-neutral-200 dark:bg-neutral-700'
            ]">
              {{ contest.difficulty }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 删除之前的 min-h-[vh95] 样式 */
</style>
