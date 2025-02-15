<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import * as monaco from 'monaco-editor'
import TokenItem from '@/components/TokenItem.vue'
import IconButton  from "@/components/IconButton.vue";

const route = useRoute();
const problemId = route.params.id;

const problem = ref({
  id: 'P1001',
  title: 'A + B Problem',
  difficulty: '入门',
});


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

const handleLanguageSelect = (lang: typeof languages[0]) => {
  selectedLanguage.value = lang;
  isMenuOpen.value = false;
  // 更新编辑器语言
  if (editorInstance.value) {
    monaco.editor.setModelLanguage(
      editorInstance.value.getModel()!,
      languageMap[lang.value]
    );
  }
};

const handleSubmit = () => {
  console.log('提交代码:', {
    problemId,
    language: selectedLanguage.value.value,
    code: code.value
  });
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
  <div class="min-h-screen bg-white dark:bg-neutral-900">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col gap-6">
        <!-- 标题栏 -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-3">
              {{ problem.id }}. {{ problem.title }}
              <TokenItem :Token="problem.difficulty" Glyph="fluent:target-20-filled"/>
            </h1>
          </div>
        </div>

        <!-- 代码编辑区 -->
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center gap-4">
            <fluent-menu 
              :open="isMenuOpen"
              @toggle="isMenuOpen = !isMenuOpen"
              class="min-w-[200px]"
            >
              <fluent-button
                appearance="outline"
                slot="trigger"
                
              >
                <div class="flex gap-2">
                  <Icon :icon="selectedLanguage.icon" class="w-5 h-5" />
                  <span>{{ selectedLanguage.label }}</span>
                  <Icon 
                    icon="fluent:chevron-down-20-filled" 
                    class="w-4 h-4 ml-2"
                    :class="{ 'transform rotate-180': isMenuOpen }"
                  />
                </div>
              </fluent-button>
              
              <fluent-menu-list>
                <fluent-menu-item
                  v-for="lang in languages"
                  :key="lang.value"
                  :value="lang.value"
                  @click="handleLanguageSelect(lang)"
                >
                  <div class="flex items-center gap-2"> 
                    <Icon :icon="lang.icon" class="w-5 h-5" />
                    <span class="font-medium">{{ lang.label }}</span>
                  </div>
                </fluent-menu-item>
              </fluent-menu-list>
            </fluent-menu>

            <IconButton class="w-auto h-auto" Glyph="fluent:send-20-filled" :onclick="handleSubmit" Text="提交代码"/>
          </div>

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
</style>
