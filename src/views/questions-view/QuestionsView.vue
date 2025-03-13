<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { ref, onMounted, reactive, watch, computed } from "vue";
import RecommendedProblems from "@/components/RecommendedProblems.vue";
import RecentSubmissions from "@/components/RecentSubmissions.vue";
import HyperlinkButton from "@/components/HyperlinkButton.vue";
import TokenItem from "@/components/TokenItem.vue";
import { getQuestions, type Question } from "@/api/questionApi";
import { getSubmissions } from "@/api/questionApi"; // 添加导入
import { isLoggedIn } from '@/stores/userStore'; // 添加导入
document.title = "Sora Online Judge • 问题";

const router = useRouter();

// 状态管理
const questions = ref<Question[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const totalCount = ref(0);

// 添加提交记录状态
interface UserSubmission {
  id: string;
  questionId: string;
  status: string;
  language: string;
  submitTime: string;
  time: string;
  memory: string;
}

const userSubmissions = ref<UserSubmission[]>([]);
const loadingSubmissions = ref(false);
const submissionError = ref<string | null>(null);

// 查询参数
const queryParams = reactive({
  searchTitle: "",
  tags: [] as string[],
  pageIndex: 1,
  pageSize: 10,  // 减少为10，与RecommendedProblems保持一致
  onlyCreatedByUser: false,
});

// 加载问题列表
async function loadQuestions() {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await getQuestions(queryParams);
    if (response.success && response.data) {
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
function handlePrevPage() {
  if (queryParams.pageIndex > 1) {
    queryParams.pageIndex--;
    loadQuestions();
  }
}

function handleNextPage() {
  if (queryParams.pageIndex < totalPages.value) {
    queryParams.pageIndex++;
    loadQuestions();
  }
}

// 计算总页数
const totalPages = computed(() => Math.ceil(totalCount.value / queryParams.pageSize));

// 组件挂载时加载数据
onMounted(() => {
  loadQuestions();
  loadUserSubmissions(); // 添加加载用户提交记录
});

// 获取难度对应的图标
function getDifficultyIcon(difficulty: string): string {
  switch(difficulty) {
    case '入门': return 'fluent:leaf-one-20-filled';
    case '简单': return 'fluent:star-20-filled';
    case '中等': return 'fluent:star-emphasis-24-filled';
    case '困难': return 'fluent:trophy-20-filled';
    default: return 'fluent:question-circle-20-regular';
  }
}

// 导航到问题详情
function navigate(questionId: string) {
  window.scrollTo(0, 0);
  router.push(`/questions/${questionId}`);
}

// 添加获取用户提交记录的函数
async function loadUserSubmissions() {
  if (!isLoggedIn.value) return;
  
  loadingSubmissions.value = true;
  submissionError.value = null;
  
  try {
    const response = await getSubmissions({
      pageIndex: 1,
      pageSize: 5,
      getAllUsers: false
    });
    
    if (response.success && response.data) {
      userSubmissions.value = response.data.map(item => ({
        id: item.id,
        questionId: item.questionId,
        status: item.status,
        language: item.language,
        submitTime: item.submitTime,
        time: `${item.timeUsed}ms`,
        memory: `${(item.memoryUsed / 1024 / 1024).toFixed(2)}MB`,
      }));
    } else {
      submissionError.value = response.message || "获取提交记录失败";
    }
  } catch (error) {
    console.error("加载提交记录失败:", error);
    submissionError.value = "加载提交记录失败";
  } finally {
    loadingSubmissions.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">题目列表</h1>
        <div class="flex gap-2">
          <fluent-text-input
            v-model="queryParams.searchTitle"
            placeholder="搜索题目..."
            class="w-64"
            @keyup.enter="searchQuestions"
          />
          <fluent-button appearance="outline" class="px-4" @click="searchQuestions">
            <Icon icon="fluent:search-20-regular" class="w-5 h-5 mr-2" />
            搜索
          </fluent-button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧题目列表 -->
      <div class="lg:col-span-2">
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">题目</h2>
            <div class="flex gap-2">
              <!-- 这里可以添加筛选按钮等内容 -->
              <fluent-button appearance="outline" class="px-4" v-if="queryParams.tags.length > 0" @click="queryParams.tags = []; loadQuestions()">
                <Icon icon="fluent:filter-dismiss-20-regular" class="w-5 h-5 mr-2" />
                清除筛选
              </fluent-button>
            </div>
          </div>
          
          <div v-if="loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <div v-else-if="error" class="text-red-500 text-center py-8 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 p-4">
            <Icon icon="fluent:error-circle-20-regular" class="w-6 h-6 mb-2 mx-auto" />
            {{ error }}
          </div>
          
          <div v-else-if="questions.length === 0" class="text-center py-8 rounded-lg border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 p-4">
            <Icon icon="fluent:document-search-20-regular" class="w-12 h-12 mb-2 mx-auto text-neutral-500" />
            <p>没有找到题目</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b-1 border-neutral-200 dark:border-neutral-700">
                  <th class="py-3 text-left">题号</th>
                  <th class="py-3 text-left">标题</th>
                  <th class="py-3 text-left">难度</th>
                  <th class="py-3 text-left">创建者</th>
                  <th class="py-3 text-left">创建时间</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="question in questions" 
                  :key="question.id"
                  class="border-b-1 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors"
                >
                  <td class="py-4">{{ question.id }}</td>
                  <td class="py-4">
                    <div>
                      <span class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        @click="navigate(question.id)">
                        {{ question.title }}
                      </span>
                      <div class="flex mt-1 flex-wrap gap-1">
                        <span 
                          v-for="tag in question.tags" 
                          :key="tag"
                          class="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full cursor-pointer"
                          @click.stop="toggleTag(tag)"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="py-4">
                    <TokenItem :Token="question.difficulty || '未知'" :Glyph="getDifficultyIcon(question.difficulty)" />
                  </td>
                  <td class="py-4">{{ question.creatorName }}</td>
                  <td class="py-4">
                    {{ question.submitCount && question.submitCount > 0 
                      ? `${Math.round((question.acceptCount || 0) / question.submitCount * 100)}%` 
                      : "未知" }}
                  </td>
                  <td class="py-4">{{ new Date(question.createTime).toLocaleDateString() }}</td>
                </tr>
              </tbody>
            </table>
            
            <!-- 分页控件 -->
            <div class="flex justify-between items-center mt-4">
              <span class="text-sm text-neutral-600 dark:text-neutral-400">
                共 {{ totalCount }} 题
              </span>
              <div class="flex gap-2">
                <fluent-button appearance="outline" @click="handlePrevPage" :disabled="queryParams.pageIndex === 1">
                  上一页
                </fluent-button>
                <span class="flex items-center mx-2">{{ queryParams.pageIndex }} / {{ totalPages }}</span>
                <fluent-button appearance="outline" @click="handleNextPage" :disabled="queryParams.pageIndex === totalPages">
                  下一页
                </fluent-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧最近提交 -->
      <div class="lg:col-span-1">
        <div v-if="loadingSubmissions" class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-4">
          <div class="flex justify-center py-6">
            <fluent-progress-ring></fluent-progress-ring>
          </div>
        </div>
        <div v-else-if="submissionError" class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-4">
          <div class="text-red-500 text-center py-4">{{ submissionError }}</div>
        </div>
        <RecentSubmissions v-else :showViewAllButton="true" :submissions="userSubmissions" title="我的提交" :showQuestionLink="true"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
fluent-text-input {
  --background-color: var(--fill-color);
}

table th {
  font-weight: 600;
}
</style>

