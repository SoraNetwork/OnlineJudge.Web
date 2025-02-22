<script setup lang="ts">
import TokenItem from "@/components/TokenItem.vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

// 定义Problem接口
interface Problem {
  id: string;
  title: string;
  difficulty: string;
  acceptance: string;
}
const router = useRouter();

const handleFilter = () => {
  // 处理筛选逻辑
  console.log("筛选题目");
};

const handleSearch = () => {
  // 处理搜索逻辑
  console.log("搜索题目");
};

const props = defineProps({
  recommendedProblems: {
    type: Array as () => Problem[],
    default: () => ([
      { id: "P1001", title: "A + B Problem", difficulty: "入门", acceptance: "95%" },
      { id: "P1002", title: "过河卒", difficulty: "简单", acceptance: "45%" },
      { id: "P1003", title: "铺地毯", difficulty: "中等", acceptance: "35%" },
      { id: "P1004", title: "方格取数", difficulty: "困难", acceptance: "25%" },
    ]),
  },
  title: {
    type: String,
    default: "题目",
  },
  link_flag: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">{{props.title}}</h2>
      <div v-if="!props.link_flag" class="flex gap-2">
        <fluent-button appearance="outline" class="px-4" @click="handleFilter">
          <Icon icon="fluent:filter-20-regular" class="w-5 h-5 mr-2" />
          筛选
        </fluent-button>
        <fluent-button appearance="outline" class="px-4" @click="handleSearch">
          <Icon icon="fluent:search-20-regular" class="w-5 h-5 mr-2" />
          搜索
        </fluent-button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b-1 border-neutral-200 dark:border-neutral-700">
            <th class="py-3 text-left">题号</th>
            <th class="py-3 text-left">标题</th>
            <th class="py-3 text-left">难度</th>
            <th class="py-3 text-left">通过率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="problem in props.recommendedProblems" :key="problem.id"
            class="border-b-1 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors">
            <td class="py-4">{{ problem.id }}</td>
            <td class="py-4">
              <span 
              class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              @click="router.push(`/questions/${problem.id}`)"
              >
              {{ problem.title }}
              </span>
            </td>
            <td class="py-4">
              <TokenItem :Token="problem.difficulty"
                :Glyph="problem.difficulty === '入门' ? 'fluent:leaf-one-20-filled' :
                       problem.difficulty === '简单' ? 'fluent:star-20-filled' :
                       problem.difficulty === '中等' ? 'fluent:star-emphasis-24-filled' : 'fluent:trophy-20-filled'"
              />
            </td>
            <td class="py-4">{{ problem.acceptance }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-neutral-600 dark:text-neutral-400">共 1000 题</span>
      <div class="flex gap-2" >
        <fluent-button v-if="!props.link_flag" appearance="outline">上一页</fluent-button>
        <fluent-button v-if="!props.link_flag" appearance="outline">下一页</fluent-button>
        <fluent-button v-if="props.link_flag" appearance="outline" @click="router.push('/questions')">查看全部</fluent-button>
      </div>
    </div>
  </div>
</template>
