<script setup lang="ts">
import { ref, onMounted, shallowRef, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import * as monaco from 'monaco-editor'
import TokenItem from '@/components/TokenItem.vue'
import IconButton  from "@/components/IconButton.vue";
import { getQuestionById, submitCode } from '@/api/questionApi';
import { message } from "@/services/MessageService"; // 导入消息服务

const route = useRoute();
const router = useRouter();
const problemId = route.params.id as string;
// 获取可能存在的比赛ID
const contestId = route.params.fromcontestid as string | null;

const problem = ref({
  id: 'P1001',
  title: 'A + B Problem',
  difficulty: '入门',
});

// 提交状态
const isSubmitting = ref(false);
// 移除 submitResult ref，使用全局消息服务替代

const languages = [
  { 
    value: 'cpp', 
    label: 'C++', 
    icon: 'vscode-icons:file-type-cpp3',
    description: 'C++17 (GCC 9.4.0)'
  },
  { 
    value: 'python', 
    label: 'Python', 
    icon: 'vscode-icons:file-type-python',
    description: 'Python 3.9.7'
  },
  { 
    value: 'java', 
    label: 'Java', 
    icon: 'vscode-icons:file-type-java',
    description: 'Java 11.0.12'
  },
  { 
    value: 'javascript', 
    label: 'JavaScript', 
    icon: 'vscode-icons:file-type-js-official',
    description: 'Node.js 16.13.0'
  }
];

// 计算是否来自比赛
const isFromContest = computed(() => !!contestId);

const code = ref('');
const selectedLanguage = ref(languages[0]); // 修改为存储完整的语言对象
const isMenuOpen = ref(false);

const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null);
const editorContainer = ref<HTMLElement | null>(null);

// 语言映射表
const languageMap: Record<string, string> = {
  'cpp': 'cpp',
  'python': 'python',
  'java': 'java',
  'javascript': 'javascript'
};

const handleLanguageSelect = (lang: any) => {
  selectedLanguage.value = lang;
  // 更新编辑器语言
  if (editorInstance.value) {
    monaco.editor.setModelLanguage(
      editorInstance.value.getModel()!,
      languageMap[selectedLanguage.value.value]
    );
  }
  isMenuOpen.value = false;
};

const fetchProblem = async () => {
  try {
    const response = await getQuestionById(problemId);
    if (response.success && response.data) {
      problem.value = {
        id: response.data.id,
        title: response.data.title,
        difficulty: response.data.difficulty,
      };
    } else {
      console.error('获取问题失败:', response.message);
    }
  } catch (error) {
    console.error('获取问题详情出错:', error);
  }
};

const handleSubmit = async () => {
  // 验证代码是否为空
  if (!code.value.trim()) {
    message.error('代码不能为空');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const response = await submitCode({
      questionId: problemId,
      language: selectedLanguage.value.value,
      code: code.value,
      contestId: contestId ? contestId : null // 传递比赛ID（如果存在）
    });
    
    if (response.success && response.data) {
      message.success(`提交成功！提交ID: ${response.data.id}`);
      
      // 跳转到提交详情页面
      router.push(`/questions/status/detail/${response.data.id}`);
    } else {
      message.error(response.message || '提交失败');
    }
  } catch (error) {
    message.error('提交请求发生错误');
    console.error('提交代码时出错:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleBack = () => {
  // 返回上一页，如果有比赛ID，则返回到比赛题目页面
  if (contestId) {
    router.push(`/questions/${problemId}/${contestId}`);
  } else {
    router.back();
  }
};

const tips = [
  {
    icon: 'fluent:document-checkmark-20-filled',
    text: '请确保您的代码符合题目要求的输入输出格式'
  },
  {
    icon: 'fluent:code-20-filled',
    text: '提交前请确认已正确选择编程语言'
  },
  {
    icon: 'fluent:shield-checkmark-20-filled',
    text: '建议在本地测试通过后再提交'
  }
];

onMounted(() => {
  // 获取问题数据
  fetchProblem();
  
  // 初始化编辑器
  editorInstance.value = monaco.editor.create(editorContainer.value!, {
    value: code.value,
    language: languageMap[selectedLanguage.value.value],
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    tabSize: 4,
    lineNumbers: 'on',
    renderLineHighlight: 'all',
    padding: { top: 16, bottom: 16 },
  });

  // 监听编辑器内容变化
  editorInstance.value.onDidChangeModelContent(() => {
    code.value = editorInstance.value!.getValue();
  });
});
</script>

<template>
  <div class="bg-white dark:bg-neutral-900">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col gap-6">
        <!-- 标题栏 -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-3">
              <fluent-button appearance="stealth" class="p-1 min-w-0" @click="handleBack">
                <Icon icon="fluent:arrow-left-20-filled" class="w-5 h-5"/>
              </fluent-button>
              {{ problem.id }}. {{ problem.title }}
              <TokenItem :Token="problem.difficulty" Glyph="fluent:target-20-filled"/>
              <!-- 添加比赛标识 -->
              <TokenItem v-if="isFromContest" :Token="`来自比赛 #${contestId}`" Glyph="fluent:trophy-20-filled" class="ml-2"/>
            </h1>
          </div>
        </div>

        <!-- 代码编辑区 -->
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center gap-4">
            <!-- 语言选择框 -->
            <div class="relative">
              <button
                @click="isMenuOpen = !isMenuOpen"
                class="flex items-center gap-2 px-4 py-2 border rounded-md bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
              >
                <Icon :icon="selectedLanguage.icon" class="w-5 h-5" />
                <span>{{ selectedLanguage.label }}</span>
                <Icon
                  icon="fluent:chevron-down-20-filled"
                  class="w-4 h-4 ml-2"
                  :class="{ 'rotate-180': isMenuOpen }"
                />
              </button>
              
              <!-- 语言下拉菜单 -->
              <div
                v-if="isMenuOpen"
                class="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-lg z-10"
              >
                <div
                  v-for="lang in languages"
                  :key="lang.value"
                  @click="handleLanguageSelect(lang)"
                  class="flex items-center gap-2 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                  :class="{
                    'bg-accent-50 dark:bg-accent-900/20': selectedLanguage.value === lang.value
                  }"
                >
                  <Icon :icon="lang.icon" class="w-5 h-5" />
                  <div class="flex flex-col">
                    <span class="font-medium">{{ lang.label }}</span>
                    <span class="text-xs text-neutral-500 dark:text-neutral-400">
                      {{ lang.description }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <IconButton 
              class="w-auto h-auto" 
              Glyph="fluent:send-20-filled" 
              :onclick="handleSubmit" 
              :Text="isFromContest ? '提交比赛答案' : '提交代码'"
              :disabled="isSubmitting"
              :loading="isSubmitting"
            />
          </div>

          <!-- 移除原有的提交结果提示组件 -->

          <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
            <div 
              ref="editorContainer"
              class="w-full h-[600px]"
            ></div>
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-l-4 border-accent">
          <h3 class="text-lg font-medium mb-3 flex items-center gap-2 text-neutral-900 dark:text-white">
            <Icon icon="fluent:lightbulb-20-filled" class="w-5 h-5 text-accent"/>
            <span>提交提示</span>
          </h3>
          <div class="space-y-2">
            <div v-for="(tip, index) in tips" 
                 :key="index"
                 class="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              <Icon :icon="tip.icon" class="w-5 h-5 mt-0.5 flex-shrink-0 text-neutral-600 dark:text-neutral-400"/>
              <span>{{ tip.text }}</span>
            </div>
          </div>
          
          <!-- 添加比赛提示 -->
          <div v-if="isFromContest" class="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <div class="flex items-start gap-3 text-sm text-accent font-medium">
              <Icon icon="fluent:trophy-20-filled" class="w-5 h-5 mt-0.5 flex-shrink-0 text-accent"/>
              <span>您正在比赛中提交代码，提交结果将计入比赛成绩</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  tab-size: 4;
}

/* 添加一些自定义样式 */
:deep(fluent-listbox) {
  --background-color: var(--neutral-layer-1);
  --border-color: var(--neutral-stroke-rest);
}

:deep(fluent-option) {
  --background-color: var(--neutral-layer-1);
  --hover-background-color: var(--neutral-layer-2);
  padding: 8px 12px;
}

:deep(fluent-option[aria-selected="true"]) {
  --background-color: var(--accent-fill-rest);
  --foreground-color: var(--neutral-foreground-rest);
}

:deep(fluent-menu) {
  --background-color: var(--neutral-layer-1);
  --border-color: var(--neutral-stroke-rest);
}

:deep(fluent-menu-item) {
  --background-color: var(--neutral-layer-1);
  --hover-background-color: var(--neutral-layer-2);
  padding: 8px 12px;
  cursor: pointer;
  justify-content: flex-start;  /* 添加这一行 */
}

:deep(fluent-menu-item[selected]) {
  --background-color: var(--accent-fill-rest);
  --foreground-color: var (--foreground-on-accent-rest);
}

:deep(.border-accent) {
  border-color: var(--accent-fill-rest);
}

:deep(.text-accent) {
  color: var(--accent-fill-rest);
}

.transform {
  transition: transform 0.2s ease;
}

/* 编辑器容器样式 */
:deep(.monaco-editor) {
  padding: 8px 0;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
