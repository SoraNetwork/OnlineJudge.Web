<script setup lang="ts">
import { computed, ref, onMounted, reactive } from 'vue';
import { Icon } from "@iconify/vue";
import router from '@/router';
import { getContests, type Contest } from '@/api/contestApi';

document.title = "Sora Online Judge • 比赛";

// 状态
const contests = ref<Contest[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const totalCount = ref(0);

// 分页和筛选参数
const params = reactive({
  status: '全部',
  type: '全部',
  sortBy: '最新',
  pageIndex: 1,
  pageSize: 20
});

// 加载比赛数据
const loadContests = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await getContests({
      status: params.status,
      type: params.type,
      sortBy: params.sortBy,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    });
    
    if (response.success && response.data) {
      contests.value = response.data;
      // 如果API返回的是分页结果，可以设置总数
      // totalCount.value = response.data.totalCount;
    } else {
      error.value = response.message || '加载比赛失败';
      contests.value = [];
    }
  } catch (err) {
    error.value = '获取比赛数据时出错';
    console.error('获取比赛列表失败:', err);
    contests.value = [];
  } finally {
    loading.value = false;
  }
};

// 初始加载
onMounted(() => {
  loadContests();
});

// 监听筛选条件变化
const applyFilters = () => {
  params.pageIndex = 1; // 重置页码
  loadContests();
};

// 菜单状态
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
            <span>{{ params.status === '全部' ? '全部状态' : params.status }}</span>
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
                @click="params.status = status; isStatusMenuOpen = false; applyFilters()"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-200 dark:bg-neutral-700': params.status === status }"
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
            <span>{{ params.type === '全部' ? '全部类型' : params.type }}</span>
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
                @click="params.type = type; isTypeMenuOpen = false; applyFilters()"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-200 dark:bg-neutral-700': params.type === type }"
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
            <span>{{ params.sortBy }}</span>
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
                @click="params.sortBy = option; isSortMenuOpen = false; applyFilters()"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-200 dark:bg-neutral-700': params.sortBy === option }"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载中状态 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
        <p>{{ error }}</p>
        <button 
          @click="loadContests"
          class="mt-2 px-3 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded hover:bg-red-300 dark:hover:bg-red-700 transition"
        >
          重试
        </button>
      </div>

      <!-- 比赛列表 -->
      <div v-else-if="contests.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <div v-for="contest in contests" :key="contest.id"
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
              <span>{{ new Date(contest.startTime).toLocaleString() }}</span>
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

      <!-- 空状态 -->
      <div v-else class="text-center py-12">
        <Icon icon="fluent:calendar-empty-20-regular" class="w-16 h-16 mx-auto text-neutral-400" />
        <p class="mt-4 text-lg text-neutral-600 dark:text-neutral-400">暂无比赛</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 删除之前的 min-h-[vh95] 样式 */
</style>
