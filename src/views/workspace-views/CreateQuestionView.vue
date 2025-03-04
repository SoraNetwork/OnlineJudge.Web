<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { hasPermission } from '@/stores/userStore';
import MarkdownEditor from '@/components/MarkdownEditor.vue';

document.title = "Sora Online Judge • 创建题目";

const router = useRouter();

// 检查权限
onMounted(() => {
  // 在实际应用中，应该检查用户是否有创建题目的权限
  // if (!hasPermission('create_problem')) {
  //   router.push('/unauthorized');
  // }
});

// 题目表单数据
const problemForm = reactive({
  id: '',
  title: '',
  description: '',
  inputDescription: '',
  outputDescription: '',
  samples: [{ input: '', output: '' }],
  difficulty: '中等', // 入门、简单、中等、困难
  timeLimit: 1000, // 默认1000ms
  memoryLimit: 256, // 默认256MB
  tags: [] as string[],
  source: '',
  hint: ''
});

// 可选择的标签列表
const availableTags = ref([
  '动态规划', '贪心', '图论', '数学', '数据结构', '字符串',
  '搜索', '分治', '模拟', '排序', '二分查找', '回溯'
]);

// 添加样例
const addSample = () => {
  problemForm.samples.push({ input: '', output: '' });
};

// 删除样例
const removeSample = (index: number) => {
  if (problemForm.samples.length > 1) {
    problemForm.samples.splice(index, 1);
  }
};

// 添加标签
const addTag = (tag: string) => {
  if (!problemForm.tags.includes(tag)) {
    problemForm.tags.push(tag);
  }
};

// 删除标签
const removeTag = (tag: string) => {
  const index = problemForm.tags.indexOf(tag);
  if (index !== -1) {
    problemForm.tags.splice(index, 1);
  }
};

// 表单提交处理
const handleSubmit = async () => {
  try {
    console.log('提交题目表单', problemForm);
    // 接下来应该调用API保存题目
    // const response = await createProblem(problemForm);
    // if (response.success) {
    //   router.push(`/questions/${response.data.id}`);
    // }
  } catch (error) {
    console.error('创建题目失败', error);
  }
};

// 预览题目
const isPreviewMode = ref(false);
const togglePreview = () => {
  isPreviewMode.value = !isPreviewMode.value;
};

// 自定义ID或使用系统生成
const useCustomId = ref(false);
</script>

<template>
  <div class="flex flex-col gap-6 p-8 max-w-6xl mx-auto">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">创建新题目</h1>
      <div class="flex gap-3">
        <fluent-button appearance="accent" @click="togglePreview">
          <Icon :icon="isPreviewMode ? 'fluent:edit-20-filled' : 'fluent:eye-20-filled'" class="w-5 h-5 mr-2" />
          {{ isPreviewMode ? '编辑' : '预览' }}
        </fluent-button>
        <fluent-button appearance="accent" @click="handleSubmit">
          <Icon icon="fluent:save-20-filled" class="w-5 h-5 mr-2" />
          保存题目
        </fluent-button>
      </div>
    </div>

    <!-- 题目表单 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 左侧列：基本信息 -->
      <div class="md:col-span-2 flex flex-col gap-6">
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <h2 class="text-xl font-semibold mb-4">基本信息</h2>
          
          <div class="flex flex-col gap-4">
            <!-- 题目ID -->
            <div class="flex items-center gap-2 mb-2">
              <fluent-checkbox @change="useCustomId = !useCustomId">
                自定义题目ID
              </fluent-checkbox>
            </div>
            
            <fluent-text-field v-if="useCustomId" v-model="problemForm.id" label="题目ID" placeholder="例如: P1001">
              <span slot="start">ID</span>
            </fluent-text-field>
            
            <!-- 题目标题 -->
            <fluent-text-field v-model="problemForm.title" label="题目标题" placeholder="请输入题目标题" required>
              <span slot="start">标题</span>
            </fluent-text-field>
            
            <!-- 题目描述 -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">题目描述</label>
              <MarkdownEditor v-model="problemForm.description" height="200px" placeholder="请输入题目描述..." />
            </div>
            
            <!-- 输入描述 -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">输入描述</label>
              <MarkdownEditor v-model="problemForm.inputDescription" height="150px" placeholder="请描述输入格式..." />
            </div>
            
            <!-- 输出描述 -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">输出描述</label>
              <MarkdownEditor v-model="problemForm.outputDescription" height="150px" placeholder="请描述输出格式..." />
            </div>
          </div>
        </div>

        <!-- 样例 -->
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">样例</h2>
            <fluent-button appearance="outline" @click="addSample">
              <Icon icon="fluent:add-20-filled" class="w-5 h-5 mr-2" />
              添加样例
            </fluent-button>
          </div>
          
          <div class="flex flex-col gap-6">
            <div v-for="(sample, index) in problemForm.samples" :key="index" class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg p-4">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-medium">样例 #{{ index + 1 }}</h3>
                <fluent-button appearance="lightweight" @click="removeSample(index)" :disabled="problemForm.samples.length <= 1">
                  <Icon icon="fluent:delete-20-regular" class="w-5 h-5 text-red-600" />
                </fluent-button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium">输入</label>
                  <fluent-text-area v-model="sample.input" resize="both" rows="5" placeholder="样例输入..."></fluent-text-area>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium">输出</label>
                  <fluent-text-area v-model="sample.output" resize="both" rows="5" placeholder="样例输出..."></fluent-text-area>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提示和说明 -->
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <h2 class="text-xl font-semibold mb-4">提示与说明</h2>
          
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">提示信息（可选）</label>
              <MarkdownEditor v-model="problemForm.hint" height="150px" placeholder="可以提供解题思路或其他帮助信息..." />
            </div>
            
            <fluent-text-field v-model="problemForm.source" label="题目来源" placeholder="例如: NOIP 2023 或 原创">
              <span slot="start">来源</span>
            </fluent-text-field>
          </div>
        </div>
      </div>
      
      <!-- 右侧列：题目设置 -->
      <div class="flex flex-col gap-6">
        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <h2 class="text-xl font-semibold mb-4">题目设置</h2>
          
          <div class="flex flex-col gap-5">
            <!-- 难度设置 -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">难度等级</label>
              <fluent-radio-group orientation="horizontal">
                <fluent-radio value="入门" @click="problemForm.difficulty = '入门'">入门</fluent-radio>
                <fluent-radio value="简单" @click="problemForm.difficulty = '简单'">简单</fluent-radio>
                <fluent-radio value="中等" @click="problemForm.difficulty = '中等'">中等</fluent-radio>
                <fluent-radio value="困难" @click="problemForm.difficulty = '困难'">困难</fluent-radio>
              </fluent-radio-group>
            </div>
            
            <!-- 时间限制 -->
            <fluent-number-field
              v-model="problemForm.timeLimit"
              label="时间限制 (ms)"
              :min="100"
              :max="10000"
              step="100"
            >
              <span slot="end">ms</span>
            </fluent-number-field>
            
            <!-- 内存限制 -->
            <fluent-number-field
              v-model="problemForm.memoryLimit"
              label="内存限制 (MB)"
              :min="16"
              :max="1024"
              step="16"
            >
              <span slot="end">MB</span>
            </fluent-number-field>
            
            <!-- 标签设置 -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">题目标签</label>
              <div class="flex flex-wrap gap-2 mb-3">
                <div v-for="tag in problemForm.tags" :key="tag"
                  class="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-2 py-1 rounded-full">
                  <span>{{ tag }}</span>
                  <button @click="removeTag(tag)" class="focus:outline-none">
                    <Icon icon="fluent:dismiss-16-filled" class="w-3 h-3" />
                  </button>
                </div>
                <span v-if="problemForm.tags.length === 0" class="text-neutral-500 text-sm">尚未添加标签</span>
              </div>
              
              <div class="border-1 border-neutral-300 dark:border-neutral-700 rounded-lg p-3 max-h-48 overflow-y-auto">
                <div class="flex flex-wrap gap-2">
                  <button v-for="tag in availableTags" :key="tag"
                    @click="addTag(tag)"
                    :disabled="problemForm.tags.includes(tag)"
                    :class="[
                      'px-2 py-1 rounded-full text-sm',
                      problemForm.tags.includes(tag)
                        ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-200'
                    ]"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
          <h2 class="text-xl font-semibold mb-4">测试数据</h2>
          <p class="text-neutral-600 dark:text-neutral-400 mb-4">请在保存题目后上传测试数据。</p>
          <fluent-button appearance="outline" disabled>
            <Icon icon="fluent:cloud-add-20-regular" class="w-5 h-5 mr-2" />
            上传测试数据
          </fluent-button>
        </div>
      </div>
    </div>
  </div>
</template>
