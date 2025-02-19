<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from "@iconify/vue";

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
  // 添加更多比赛数据...
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
</script>

<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">竞赛</h1>
      <p class="text-neutral-600 dark:text-neutral-400">
        参加编程竞赛，提升你的算法实力
      </p>
    </div>

    <!-- 筛选和排序工具栏 -->
    <div class="flex flex-wrap gap-4 mb-6">
      <fluent-menu>
        <fluent-menu-button
          class="min-w-32 px-3 py-1.5 rounded-sm transition bg-transparent dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          {{ filterStatus === '全部' ? '全部状态' : filterStatus }}
          <Icon icon="fluent:chevron-down-20-regular" class="w-4 h-4 ml-2" />
        </fluent-menu-button>
        <fluent-menu-list class="min-w-32 rounded-md gap-1 p-1 mt-2 backdrop-blur-md bg-neutral-100/80 dark:bg-neutral-800/80">
          <fluent-menu-item
            v-for="status in ['全部', '即将开始', '进行中', '已结束']"
            :key="status"
            @click="filterStatus = status"
            class="bg-transparent pl-2 pr-5 dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            role="menuitemradio"
            :checked="filterStatus === status"
          >
            {{ status === '全部' ? '全部状态' : status }}
          </fluent-menu-item>
        </fluent-menu-list>
      </fluent-menu>

      <fluent-menu>
        <fluent-menu-button
          class="min-w-32 px-3 py-1.5 rounded-sm transition bg-transparent dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          {{ filterType === '全部' ? '全部类型' : filterType }}
          <Icon icon="fluent:chevron-down-20-regular" class="w-4 h-4 ml-2" />
        </fluent-menu-button>
        <fluent-menu-list class="min-w-32 rounded-md gap-1 p-1 mt-2 backdrop-blur-md bg-neutral-100/80 dark:bg-neutral-800/80">
          <fluent-menu-item
            v-for="type in ['全部', '公开赛', '私有赛', '练习赛']"
            :key="type"
            @click="filterType = type"
            class="bg-transparent pl-2 pr-5 dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            role="menuitemradio"
            :checked="filterType === type"
          >
            {{ type === '全部' ? '全部类型' : type }}
          </fluent-menu-item>
        </fluent-menu-list>
      </fluent-menu>

      <fluent-menu>
        <fluent-menu-button
          class="min-w-32 px-3 py-1.5 rounded-sm transition bg-transparent dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          {{ sortBy }}
          <Icon icon="fluent:chevron-down-20-regular" class="w-4 h-4 ml-2" />
        </fluent-menu-button>
        <fluent-menu-list class="min-w-32 rounded-md gap-1 p-1 mt-2 backdrop-blur-md bg-neutral-100/80 dark:bg-neutral-800/80">
          <fluent-menu-item
            v-for="option in ['最新', '参与人数']"
            :key="option"
            @click="sortBy = option"
            class="bg-transparent pl-2 pr-5 dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            role="menuitemradio"
            :checked="sortBy === option"
          >
            {{ option }}
          </fluent-menu-item>
        </fluent-menu-list>
      </fluent-menu>
    </div>

    <!-- 竞赛列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="contest in filteredContests" :key="contest.id"
        class="bg-neutral-50 dark:bg-neutral-800 rounded-lg border-1 border-neutral-200 dark:border-neutral-700 p-6 hover:border-blue-500 transition-colors">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
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
</template>
