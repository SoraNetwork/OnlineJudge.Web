<script setup lang="js">

import { Editor } from '@bytemd/vue-next'
import { Viewer } from '@bytemd/vue-next'
import 'bytemd/dist/index.css'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import TokenItem from '@/components/TokenItem.vue'
import router from '@/router'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import math from '@bytemd/plugin-math'
import zhHans from 'bytemd/lib/locales/zh_Hans.json'
import RecentSubmissions from '@/components/RecentSubmissions.vue'
import { getQuestionById, getSubmissions } from '@/api/questionApi'
import { isLoggedIn } from '@/stores/userStore' // 导入登录状态

const route = useRoute();
const problemId = route.params.id;
const fromcontestId = route.params.fromcontestid;

const problem = ref({
  id: '',
  title: '',
  difficulty: '',
  timeLimit: 0,
  memoryLimit: 0,
  tags: [],
  // acceptance: '', // 注释掉，因为后端没有正确维护这个值
  author: {
    username: '',
    nickname: '',
    avatar: ''
  },
  createTime: '',
  content: ''
});

const isEditing = ref(false);
const editedContent = ref('');
const isLoading = ref(true);
const errorMessage = ref('');

// 修改提交记录数据结构
const submissions = ref({
  personalSubmissions: [], // 个人提交记录
  otherSubmissions: []     // 他人提交记录
})

const loadingSubmissions = ref(false);
const submissionError = ref('');

// 计算要显示的提交记录
const displaySubmissions = computed(() => {
  return submissions.value.personalSubmissions.length > 0 
    ? submissions.value.personalSubmissions 
    : submissions.value.otherSubmissions
})

// 计算是否来自比赛
const isFromContest = computed(() => !!fromcontestId);

onMounted(async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // 同时加载问题详情和提交记录
    const [questionResponse] = await Promise.all([
      getQuestionById(problemId),
      loadSubmissionRecords() // 添加加载提交记录的方法调用
    ]);
    
    if (questionResponse.success && questionResponse.data) {
      const questionData = questionResponse.data;
      // 计算通过率 - 注释掉，因为后端没有正确维护这个值
      // const acceptanceRate = questionData.submitCount > 0 
      //   ? ((questionData.acceptCount / questionData.submitCount) * 100).toFixed(1) + '%'
      //   : '0%';
        
      problem.value = {
        id: questionData.id,
        title: questionData.title,
        difficulty: questionData.difficulty || '未知',
        timeLimit: questionData.timeLimit || 1000,
        memoryLimit: questionData.memoryLimit || 256,
        tags: questionData.tags || [],
        // acceptance: acceptanceRate, // 注释掉，因为后端没有正确维护这个值
        author: {
          username: questionData.creatorName || 'anonymous',
          nickname: questionData.creatorName || '匿名用户',
avatar: '' // 如果API没有返回头像，使用默认值
        },
        createTime: formatDateTime(questionData.createTime) || '',
        content: questionData.description || '',
        submitCount: questionData.submitCount,
        acceptCount: questionData.acceptCount,
        visibility: questionData.visibility || []
      };
      editedContent.value = questionData.description;
    } else {
      errorMessage.value = questionResponse.message || '获取问题数据失败';
    }
  } catch (error) {
    console.error('获取问题详情出错:', error);
    errorMessage.value = '获取问题数据时发生错误，请稍后再试';
  } finally {
    isLoading.value = false;
  }
});

// 添加获取提交记录的方法
const loadSubmissionRecords = async () => {
  loadingSubmissions.value = true;
  submissionError.value = '';
  
  try {
    // 获取当前用户对此题目的提交
    if (isLoggedIn.value) {
      const personalResponse = await getSubmissions({
        questionId: problemId,
        pageIndex: 1,
        pageSize: 5,
        getAllUsers: false
      });
      
      if (personalResponse.success && personalResponse.data) {
        submissions.value.personalSubmissions = personalResponse.data.map(item => ({
          id: item.id,
          questionId: item.questionId,
          status: item.status,
          language: item.language,
          submitTime: item.submitTime,
          time: `${item.timeUsed}ms`,
          memory: `${(item.memoryUsed / 1024 / 1024).toFixed(2)}MB`,
        }));
      }
    }
    
    // 获取其他用户对此题目的提交
    const otherResponse = await getSubmissions({
      questionId: problemId,
      pageIndex: 1,
      pageSize: 5,
      getAllUsers: true
    });
    
    if (otherResponse.success && otherResponse.data) {
      submissions.value.otherSubmissions = otherResponse.data
        .filter(item => !submissions.value.personalSubmissions.some(ps => ps.id === item.id)) // 排除个人提交
        .map(item => ({
          id: item.id,
          questionId: item.questionId,
          status: item.status,
          language: item.language,
          submitTime: item.submitTime,
          time: `${item.timeUsed}ms`,
          memory: `${(item.memoryUsed / 1024 / 1024).toFixed(2)}MB`,
          username: item.userName
        }));
    }
  } catch (error) {
    console.error('获取提交记录失败:', error);
    submissionError.value = '获取提交记录失败，请稍后重试';
  } finally {
    loadingSubmissions.value = false;
  }
};

// 添加日期格式化函数
const formatDateTime = (isoDateString) => {
  if (!isoDateString) return '';
  try {
    const date = new Date(isoDateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('日期格式化错误:', e);
    return isoDateString;
  }
};

// 添加获取首字母函数
const getInitials = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

const handleEdit = () => {
  isEditing.value = true;
};

const handleSave = () => {
  problem.value.content = editedContent.value;
  isEditing.value = false;
  // 这里应该调用API保存更改
};

const handleSubmit = () => {
  if (fromcontestId) {
    router.push(`/questions/${problemId}/submit/${fromcontestId}`);
  } else {
    router.push(`/questions/${problemId}/submit`);
  }
};

const handleEditorChange = (v) => {
  editedContent.value = v;
};

const handleBack = () => {
  router.back();
};
</script>

<template>
  <div class="bg-white dark:bg-neutral-900">
    <div class="container mx-auto px-4 py-6">
      <div v-if="isLoading" class="flex justify-center min-h-[200px] w-full items-center">
        <fluent-progress-bar indeterminate></fluent-progress-bar>
      </div>
      
      <div v-else-if="errorMessage" class="flex flex-col items-center justify-center min-h-[200px] w-full">
        <Icon icon="fluent:error-circle-20-filled" class="w-12 h-12 text-red-500 mb-4" />
        <p class="text-lg text-red-500">{{ errorMessage }}</p>
        <fluent-button appearance="accent" class="mt-4" @click="handleBack">
          返回问题列表
        </fluent-button>
      </div>
      
      <template v-else>
        <!-- 标题栏 -->
        <div class="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-3">
              <fluent-button appearance="stealth" class="p-1 min-w-0" @click="handleBack">
                <Icon icon="fluent:arrow-left-20-filled" class="w-5 h-5"/>
              </fluent-button>
              {{ problem.id }}. {{ problem.title }}
              <TokenItem :Token="problem.difficulty" Glyph="fluent:target-20-filled"/>
              <!-- 添加比赛标识 -->
              <TokenItem v-if="isFromContest" :Token="`来自比赛 #${fromcontestId}`" Glyph="fluent:trophy-20-filled" class="ml-2"/>
            </h1>
            <div class="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
              <span>时间限制: {{ problem.timeLimit }}ms</span>
              <span>内存限制: {{ problem.memoryLimit }}MB</span>
              <!-- 注释掉通过率显示，因为后端没有正确维护这个值 -->
              <!-- <span>通过率: {{ problem.acceptance }}</span> -->
              <span class="flex items-center gap-2">
                <span>作者:</span>
                <template v-if="problem.author.avatar">
                  <img 
                    :src="problem.author.avatar" 
                    :alt="problem.author.nickname"
                    class="w-5 h-5 rounded-full"
                  />
                </template>
                <template v-else>
                  <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                    {{ getInitials(problem.author.nickname) }}
                  </div>
                </template>
                <span>{{ problem.author.nickname }}</span>
              </span>
              <span class="text-neutral-500">
                创建于 {{ problem.createTime }}
              </span>
            </div>
          </div>
          <div class="flex gap-3">
            <fluent-button v-if="isEditing" appearance="accent" @click="handleSave">
              <Icon icon="fluent:save-20-filled" class="w-5 h-5 mr-2"/>
              保存
            </fluent-button>
            <!--
            <fluent-button v-else appearance="outline" @click="handleEdit">
              <Icon icon="fluent:edit-20-filled" class="w-5 h-5 mr-2"/>
              编辑
            </fluent-button>
            -->
            <fluent-button appearance="accent" @click="handleSubmit">
              <Icon icon="fluent:send-20-filled" class="w-5 h-5 mr-2"/>
              提交
            </fluent-button>
          </div>
        </div>

        <!-- 主要内容区域 - 使用网格布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- 左侧题目内容 -->
          <div :class="{'lg:col-span-3': !isEditing, 'lg:col-span-4': isEditing}">
            <div class="flex gap-2 mb-4">
              <TokenItem v-for="tag in problem.tags" :key="tag" :Token="tag" Glyph="fluent:tag-20-filled"/>
            </div>

            <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
              <div v-if="isEditing" class="min-h-[500px] w-full">
                <div class="dark:invert">
                  <Editor
                    :value="editedContent"
                    :plugins="plugins"
                    :locale="zhHans"
                    @change="handleEditorChange"
                    class="w-full"
                  />
                </div>
              </div>
              <div v-else class="p-6 markdown-body custom-markdown">
                <Viewer
                  :value="problem.content"
                  :plugins="plugins"
                />
              </div>
            </div>
          </div>

          <!-- 右侧提交记录 - 仅在非编辑模式显示 -->
          <div v-if="!isEditing" class="lg:col-span-1">
            <div v-if="loadingSubmissions" class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-4">
              <div class="flex justify-center py-6">
                <fluent-progress-ring></fluent-progress-ring>
              </div>
            </div>
            <div v-else-if="submissionError" class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-4">
              <div class="text-red-500 text-center py-4">{{ submissionError }}</div>
            </div>
            <RecentSubmissions 
              v-else
              :show-view-all-button="true"
              :submissions="displaySubmissions"
              :show-username="submissions.personalSubmissions.length === 0"
              :title="submissions.personalSubmissions.length > 0 ? '我的提交' : '最近提交'"
              :showQuestionLink="false"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="js">
const plugins=[
  gfm(),
  highlight(),
  breaks(),
  frontmatter(),
  math()
];

export default {
  components: { Editor , Viewer},
  data() {
    return { value: '', plugins }
  },
  methods: {
    handleChange(v) {
      this.value = v
    },
  },
}
</script>

<style>
.custom-markdown {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.custom-markdown h2 {
  font-weight: 600;
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.custom-markdown code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.custom-markdown table {
  width: 100%;
  margin: 1rem 0;
}

.custom-markdown td, .custom-markdown th {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
}

.dark .custom-markdown td, .dark .custom-markdown th {
  border-color: #374151;
}
</style>