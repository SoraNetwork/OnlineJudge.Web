<script setup lang="ts">
import TokenItem from "@/components/TokenItem.vue";
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { Dialog } from "@fluentui/web-components";

// 定义Problem接口
interface Problem {
  id: string;
  title: string;
  difficulty: string;
  acceptance: string;
}
const router = useRouter();

const searchDialog = ref<Dialog | null>(null);
const filterDialog = ref<Dialog | null>(null);

const handleFilter = () => {
  filterDialog.value?.show();
};

const handleSearch = () => {
  searchDialog.value?.show();
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

const navigate = (path: string) => {
  window.scrollTo(0, 0);
  router.push(path);
}

// 搜索和筛选状态
const searchDialogOpen = ref(false);
const filterDialogOpen = ref(false);
const searchKeyword = ref('');
const selectedDifficulty = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

// 难度选项
const difficultyOptions = ['入门', '简单', '中等', '困难'];

// 修改复选框状态管理的初始值为全选
const difficultyStates = ref<Record<string, boolean>>(
  difficultyOptions.reduce((acc, difficulty) => ({
    ...acc,
    [difficulty]: true  // 修改为 true
  }), {})
);

// 初始化选中所有难度
selectedDifficulty.value = [...difficultyOptions];

// 修改处理复选框变化的方法
const handleCheckboxChange = (difficulty: string, checked: boolean) => {
  difficultyStates.value[difficulty] = checked;
  selectedDifficulty.value = Object.entries(difficultyStates.value)
    .filter(([_, value]) => value)
    .map(([key, _]) => key);
};

// 应用筛选
const applyFilter = () => {
  filterDialog.value?.hide();
  currentPage.value = 1;
};

// 应用搜索
const applySearch = () => {
  searchDialog.value?.hide();
  currentPage.value = 1;
};

// 添加关闭对话框方法
const closeSearchDialog = () => {
  searchDialog.value?.hide();
};

const closeFilterDialog = () => {
  filterDialog.value?.hide();
};

// 分页处理
const totalPages = computed(() => Math.ceil(props.recommendedProblems.length / pageSize.value));

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 过滤后的问题列表
const filteredProblems = computed(() => {
  let result = [...props.recommendedProblems];

  // 应用搜索过滤
  if (searchKeyword.value) {
    result = result.filter(problem =>
      problem.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      problem.id.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  }

  // 应用难度过滤
  if (selectedDifficulty.value.length > 0) {
    result = result.filter(problem =>
      selectedDifficulty.value.includes(problem.difficulty)
    );
  }

  return result;
});

// 当前页的问题
const currentPageProblems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredProblems.value.slice(start, end);
});
</script>

<template>
  <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">{{ props.title }}</h2>
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

    <!-- 修改搜索对话框 -->
    <fluent-dialog ref="searchDialog">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">搜索题目</h3>
          <fluent-button appearance="lightweight" @click="closeSearchDialog">
            <Icon icon="fluent:dismiss-20-regular" class="w-5 h-5" />
          </fluent-button>
        </div>
        <fluent-text-input v-model="searchKeyword" placeholder="输入题目编号或标题" class="min-w-[97%] mb-4" />
        <div class="flex justify-end gap-2">
          <fluent-button appearance="secondary" @click="closeSearchDialog">取消</fluent-button>
          <fluent-button appearance="accent" @click="applySearch">搜索</fluent-button>
        </div>
      </div>
    </fluent-dialog>

    <!-- 修改筛选对话框 -->
    <fluent-dialog ref="filterDialog">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">筛选题目</h3>
          <fluent-button appearance="lightweight" @click="closeFilterDialog">
            <Icon icon="fluent:dismiss-20-regular" class="w-5 h-5" />
          </fluent-button>
        </div>
        <div class="mb-4">
          <h4 class="font-medium mb-2">难度</h4>
          <div class="flex flex-row flex-wrap gap-4">
            <fluent-field v-for="difficulty in difficultyOptions" 
              :key="difficulty" 
              label-position="after"
              class="min-w-[80px]"
            >
              <label :for="'checkbox-' + difficulty" slot="label">{{ difficulty }}</label>
              <fluent-checkbox
                :id="'checkbox-' + difficulty"
                slot="input"
                :checked="difficultyStates[difficulty]"
                @change="(e: Event) => handleCheckboxChange(difficulty, (e.target as HTMLInputElement).checked)"
              ></fluent-checkbox>
            </fluent-field>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <fluent-button appearance="secondary" @click="closeFilterDialog">取消</fluent-button>
          <fluent-button appearance="accent" @click="applyFilter">应用</fluent-button>
        </div>
      </div>
    </fluent-dialog>

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
          <tr v-for="problem in currentPageProblems" :key="problem.id"
            class="border-b-1 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors">
            <td class="py-4">{{ problem.id }}</td>
            <td class="py-4">
              <span class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                @click="navigate(`/questions/${problem.id}`)">
                {{ problem.title }}
              </span>
            </td>
            <td class="py-4">
              <TokenItem :Token="problem.difficulty" :Glyph="problem.difficulty === '入门' ? 'fluent:leaf-one-20-filled' :
                problem.difficulty === '简单' ? 'fluent:star-20-filled' :
                  problem.difficulty === '中等' ? 'fluent:star-emphasis-24-filled' : 'fluent:trophy-20-filled'" />
            </td>
            <td class="py-4">{{ problem.acceptance }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-neutral-600 dark:text-neutral-400">
        共 {{ filteredProblems.length }} 题
      </span>
      <div class="flex gap-2" v-if="!props.link_flag">
        <fluent-button appearance="outline" @click="handlePrevPage" :disabled="currentPage === 1">
          上一页
        </fluent-button>
        <span class="flex items-center mx-2">{{ currentPage }} / {{ totalPages }}</span>
        <fluent-button appearance="outline" @click="handleNextPage" :disabled="currentPage === totalPages">
          下一页
        </fluent-button>
      </div>
      <div class="flex gap-2">
        <fluent-button v-if="props.link_flag" appearance="outline"
          @click="router.push('/questions')">查看全部</fluent-button>
      </div>
    </div>
  </div>
</template>

<style>
fluent-dialog {
  --dialog-width: 500px;
  --dialog-height: auto;
}

fluent-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

fluent-checkbox {
  margin: 0;
}
</style>
