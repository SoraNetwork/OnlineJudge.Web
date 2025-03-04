、】、、<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { ref, onMounted, reactive, watch } from "vue";
import RecommendedProblems from "@/components/RecommendedProblems.vue";
import RecentSubmissions from "@/components/RecentSubmissions.vue";
import { getQuestions, type Question } from "@/api/question";
document.title = "Sora Online Judge • 问题";

const router = useRouter();

// 状态管理
const questions = ref<Question[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const totalCount = ref(0);

// 查询参数
const queryParams = reactive({
  searchTitle: "",
  tags: [] as string[],
  pageIndex: 1,
  pageSize: 20,
  onlyCreatedByUser: false,
});

// 加载问题列表
async function loadQuestions() {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await getQuestions(queryParams);
    if (response.success) {
      questions.value = response.data.items;
      totalCount.value = response.data.totalCount;
    } else {
      error.value = response.message || "获取题目列表失败";
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "获取题目列表时发生错误";
  } finally {
    loading.value = false;
  }
}

// 搜索题目
function searchQuestions() {
  queryParams.pageIndex = 1; // 重置页码
  loadQuestions();
}

// 添加或删除标签过滤
function toggleTag(tag: string) {
  const index = queryParams.tags.indexOf(tag);
  if (index !== -1) {
    queryParams.tags.splice(index, 1);
  } else {
    queryParams.tags.push(tag);
  }
  queryParams.pageIndex = 1; // 重置页码
  loadQuestions();
}

// 切换页码
function changePage(page: number) {
  queryParams.pageIndex = page;
  loadQuestions();
}

// 组件挂载时加载数据
onMounted(() => {
  loadQuestions();
});
</script>

<template>
  <div class="container mx-auto px-4 py-6 dark:bg-gray-800">
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">题目列表</h1>
        <div class="flex space-x-2">
          <input
            v-model="queryParams.searchTitle"
            type="text"
            placeholder="搜索题目..."
            class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            @keyup.enter="searchQuestions"
          />
          <button
            @click="searchQuestions"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600"
          >
            <Icon icon="mdi:magnify" class="text-lg" />
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧题目列表 -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div v-if="loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <div v-else-if="error" class="text-red-500 text-center py-8">
            {{ error }}
          </div>
          
          <div v-else-if="questions.length === 0" class="text-center py-8">
            没有找到题目
          </div>
          
          <div v-else>
            <table class="w-full">
              <thead>
                <tr class="border-b dark:border-gray-600">
                  <th class="pb-2 text-left">标题</th>
                  <th class="pb-2 text-left">创建者</th>
                  <th class="pb-2 text-left">创建时间</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="question in questions" 
                  :key="question.id"
                  class="border-b last:border-b-0 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  @click="router.push(`/questions/${question.id}`)"
                >
                  <td class="py-3">
                    <div class="font-medium">{{ question.title }}</div>
                    <div class="flex mt-1 space-x-2">
                      <span 
                        v-for="tag in question.tags" 
                        :key="tag"
                        class="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                        @click.stop="toggleTag(tag)"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </td>
                  <td class="py-3">{{ question.creatorName }}</td>
                  <td class="py-3">{{ new Date(question.createTime).toLocaleDateString() }}</td>
                </tr>
              </tbody>
            </table>
            
            <!-- 分页 -->
            <div class="flex justify-center mt-6">
              <div class="flex space-x-1">
                <button
                  v-for="page in Math.ceil(totalCount / queryParams.pageSize)"
                  :key="page"
                  @click="changePage(page)"
                  class="px-3 py-1 rounded"
                  :class="{
                    'bg-blue-500 text-white': queryParams.pageIndex === page,
                    'bg-gray-200 dark:bg-gray-600': queryParams.pageIndex !== page
                  }"
                >
                  {{ page }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧最近提交 -->
      <div class="lg:col-span-1">
        <RecentSubmissions :showViewAllButton="true" :submissions="[]" title="最近提交"/>
      </div>
    </div>
  </div>
</template>

