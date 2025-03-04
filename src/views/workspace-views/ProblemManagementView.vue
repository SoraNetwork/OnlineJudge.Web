<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

document.title = "Sora Online Judge • 题目管理";

const router = useRouter();

// 模拟题目数据
const problems = ref([
  { 
    id: 'P1001', 
    title: 'A + B Problem', 
    difficulty: '入门',
    tags: ['模拟', '数学'],
    createdBy: 'admin', 
    createdAt: '2023-10-01',
    status: '公开',
    acceptedCount: 1024,
    submissionCount: 1200
  },
  { 
    id: 'P1002', 
    title: '过河卒', 
    difficulty: '简单',
    tags: ['动态规划', '递归'],
    createdBy: 'alice', 
    createdAt: '2023-12-15',
    status: '公开',
    acceptedCount: 542,
    submissionCount: 850
  },
  { 
    id: 'P1003', 
    title: '铺地毯', 
    difficulty: '中等',
    tags: ['模拟', '枚举'],
    createdBy: 'bob', 
    createdAt: '2023-11-20',
    status: '私有',
    acceptedCount: 320,
    submissionCount: 612
  },
  { 
    id: 'P1004', 
    title: '方格取数', 
    difficulty: '困难',
    tags: ['动态规划', '状态压缩'],
    createdBy: 'admin', 
    createdAt: '2023-12-01',
    status: '公开',
    acceptedCount: 105,
    submissionCount: 450
  },
]);

// 搜索和筛选
const searchKeyword = ref('');
const difficultyFilter = ref('all'); // 'all', 'beginner', 'easy', 'medium', 'hard'
const statusFilter = ref('all'); // 'all', 'public', 'private'

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const totalProblems = ref(100); // 模拟总题目数

// 排序
const sortField = ref('id');
const sortDirection = ref('asc');

// 选中的题目
const selectedProblems = ref<string[]>([]);

// 批量操作对话框
const isBulkActionDialogOpen = ref(false);
const bulkAction = ref(''); // 'publish', 'unpublish', 'delete', 'change-difficulty'

// 按条件过滤题目
const filteredProblems = computed(() => {
  let result = problems.value;
  
  // 搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(problem => 
      problem.id.toLowerCase().includes(keyword) || 
      problem.title.toLowerCase().includes(keyword)
    );
  }
  
  // 难度筛选
  if (difficultyFilter.value !== 'all') {
    const difficultyMap: Record<string, string> = {
      'beginner': '入门',
      'easy': '简单',
      'medium': '中等',
      'hard': '困难'
    };
    result = result.filter(problem => problem.difficulty === difficultyMap[difficultyFilter.value]);
  }
  
  // 状态筛选
  if (statusFilter.value !== 'all') {
    const isPublic = statusFilter.value === 'public';
    result = result.filter(problem => (problem.status === '公开') === isPublic);
  }
  
  // 排序
  result = [...result].sort((a, b) => {
    const factor = sortDirection.value === 'asc' ? 1 : -1;
    
    if (sortField.value === 'id') {
      return factor * a.id.localeCompare(b.id);
    } else if (sortField.value === 'title') {
      return factor * a.title.localeCompare(b.title);
    } else if (sortField.value === 'difficulty') {
      const difficultyOrder: Record<string, number> = {
        '入门': 1,
        '简单': 2,
        '中等': 3,
        '困难': 4
      };
      return factor * (difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    } else if (sortField.value === 'createdAt') {
      return factor * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortField.value === 'acceptedRate') {
      const rateA = a.acceptedCount / a.submissionCount;
      const rateB = b.acceptedCount / b.submissionCount;
      return factor * (rateA - rateB);
    }
    return 0;
  });
  
  return result;
});

// 选择/取消选择所有题目
const toggleSelectAll = () => {
  if (selectedProblems.value.length === filteredProblems.value.length) {
    selectedProblems.value = [];
  } else {
    selectedProblems.value = filteredProblems.value.map(problem => problem.id);
  }
};

// 选择/取消选择单个题目
const toggleSelectProblem = (problemId: string) => {
  const index = selectedProblems.value.indexOf(problemId);
  if (index === -1) {
    selectedProblems.value.push(problemId);
  } else {
    selectedProblems.value.splice(index, 1);
  }
};

// 打开批量操作对话框
const openBulkActionDialog = (action: string) => {
  if (selectedProblems.value.length === 0) return;
  bulkAction.value = action;
  isBulkActionDialogOpen.value = true;
};

// 执行批量操作
const executeBulkAction = () => {
  if (bulkAction.value === 'publish') {
    problems.value = problems.value.map(problem => 
      selectedProblems.value.includes(problem.id) ? { ...problem, status: '公开' } : problem
    );
  } else if (bulkAction.value === 'unpublish') {
    problems.value = problems.value.map(problem => 
      selectedProblems.value.includes(problem.id) ? { ...problem, status: '私有' } : problem
    );
  } else if (bulkAction.value === 'delete') {
    problems.value = problems.value.filter(problem => !selectedProblems.value.includes(problem.id));
  }
  
  selectedProblems.value = [];
  isBulkActionDialogOpen.value = false;
};

// 处理排序
const changeSort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
};

// 处理分页
const changePage = (page: number) => {
  currentPage.value = page;
  // 这里可以添加获取对应页数据的API调用
};

// 创建新题目
const createNewProblem = () => {
  router.push('/workspace/questions/create');
};

// 获取难度对应的颜色类名
const getDifficultyColor = (difficulty: string) => {
  const colors = {
    '入门': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    '简单': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    '中等': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    '困难': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  };
  return colors[difficulty as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-800';
};
</script>

<template>
  <div class="flex flex-col px-6 py-8 max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">题目管理</h1>
      <p class="text-neutral-600 dark:text-neutral-400">管理系统中的所有题目</p>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="relative md:col-span-2">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索题目ID/标题..."
          class="w-full px-3 py-2 pr-10 rounded-lg border dark:bg-neutral-700 dark:border-neutral-600"
        />
        <Icon
          icon="fluent:search-20-regular"
          class="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
        />
      </div>
      
      <fluent-select v-model="difficultyFilter" class="w-full">
        <fluent-option value="all">所有难度</fluent-option>
        <fluent-option value="beginner">入门</fluent-option>
        <fluent-option value="easy">简单</fluent-option>
        <fluent-option value="medium">中等</fluent-option>
        <fluent-option value="hard">困难</fluent-option>
      </fluent-select>
      
      <fluent-select v-model="statusFilter" class="w-full">
        <fluent-option value="all">所有状态</fluent-option>
        <fluent-option value="public">公开</fluent-option>
        <fluent-option value="private">私有</fluent-option>
      </fluent-select>
    </div>

    <!-- 批量操作按钮和创建题目 -->
    <div class="mb-4 flex flex-wrap gap-2 justify-between">
      <div class="flex flex-wrap gap-2">
        <fluent-button 
          appearance="outline" 
          :disabled="selectedProblems.length === 0"
          @click="openBulkActionDialog('publish')"
        >
          <Icon icon="fluent:eye-20-filled" class="w-5 h-5 mr-2" />
          公开选中题目
        </fluent-button>
        <fluent-button 
          appearance="outline" 
          :disabled="selectedProblems.length === 0"
          @click="openBulkActionDialog('unpublish')"
        >
          <Icon icon="fluent:eye-off-20-filled" class="w-5 h-5 mr-2" />
          隐藏选中题目
        </fluent-button>
        <fluent-button 
          appearance="outline" 
          :disabled="selectedProblems.length === 0"
          @click="openBulkActionDialog('delete')"
          class="text-red-600 dark:text-red-500"
        >
          <Icon icon="fluent:delete-20-filled" class="w-5 h-5 mr-2" />
          删除选中题目
        </fluent-button>
        <span v-if="selectedProblems.length > 0" class="ml-2 self-center text-sm text-neutral-600 dark:text-neutral-400">
          已选中 {{ selectedProblems.length }} 个题目
        </span>
      </div>
      <fluent-button appearance="accent" @click="createNewProblem">
        <Icon icon="fluent:add-20-filled" class="w-5 h-5 mr-2" />
        创建题目
      </fluent-button>
    </div>

    <!-- 题目列表 -->
    <fluent-card class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-neutral-100 dark:bg-neutral-800">
            <tr>
              <th class="px-4 py-3 text-left">
                <fluent-checkbox 
                  :checked="selectedProblems.length === filteredProblems.length && filteredProblems.length > 0" 
                  :indeterminate="selectedProblems.length > 0 && selectedProblems.length < filteredProblems.length"
                  @change="toggleSelectAll"
                />
              </th>
              <th class="px-4 py-3 text-left cursor-pointer" @click="changeSort('id')">
                <div class="flex items-center">
                  题目ID
                  <Icon 
                    v-if="sortField === 'id'" 
                    :icon="sortDirection === 'asc' ? 'fluent:arrow-sort-up-20-filled' : 'fluent:arrow-sort-down-20-filled'" 
                    class="ml-1 w-4 h-4" 
                  />
                </div>
              </th>
              <th class="px-4 py-3 text-left cursor-pointer" @click="changeSort('title')">
                <div class="flex items-center">
                  标题
                  <Icon 
                    v-if="sortField === 'title'" 
                    :icon="sortDirection === 'asc' ? 'fluent:arrow-sort-up-20-filled' : 'fluent:arrow-sort-down-20-filled'" 
                    class="ml-1 w-4 h-4" 
                  />
                </div>
              </th>
              <th class="px-4 py-3 text-left cursor-pointer" @click="changeSort('difficulty')">
                <div class="flex items-center">
                  难度
                  <Icon 
                    v-if="sortField === 'difficulty'" 
                    :icon="sortDirection === 'asc' ? 'fluent:arrow-sort-up-20-filled' : 'fluent:arrow-sort-down-20-filled'" 
                    class="ml-1 w-4 h-4" 
                  />
                </div>
              </th>
              <th class="px-4 py-3 text-left">标签</th>
              <th class="px-4 py-3 text-left cursor-pointer" @click="changeSort('createdBy')">
                <div class="flex items-center">
                  创建者
                  <Icon 
                    v-if="sortField === 'createdBy'" 
                    :icon="sortDirection === 'asc' ? 'fluent:arrow-sort-up-20-filled' : 'fluent:arrow-sort-down-20-filled'" 
                    class="ml-1 w-4 h-4" 
                  />
                </div>
              </th>
              <th class="px-4 py-3 text-left cursor-pointer" @click="changeSort('createdAt')">
                <div class="flex items-center">
                  创建时间
                  <Icon 
                    v-if="sortField === 'createdAt'" 
                    :icon="sortDirection === 'asc' ? 'fluent:arrow-sort-up-20-filled' : 'fluent:arrow-sort-down-20-filled'" 
                    class="ml-1 w-4 h-4" 
                  />
                </div>
              </th>
              <th class="px-4 py-3 text-left cursor-pointer" @click="changeSort('acceptedRate')">
                <div class="flex items-center">
                  通过率
                  <Icon 
                    v-if="sortField === 'acceptedRate'" 
                    :icon="sortDirection === 'asc' ? 'fluent:arrow-sort-up-20-filled' : 'fluent:arrow-sort-down-20-filled'" 
                    class="ml-1 w-4 h-4" 
                  />
                </div>
              </th>
              <th class="px-4 py-3 text-left">状态</th>
              <th class="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="problem in filteredProblems" :key="problem.id" class="border-b dark:border-neutral-700">
              <td class="px-4 py-3">
                <fluent-checkbox 
                  :checked="selectedProblems.includes(problem.id)" 
                  @change="toggleSelectProblem(problem.id)" 
                />
              </td>
              <td class="px-4 py-3">
                <a class="text-blue-600 hover:underline cursor-pointer" @click="router.push(`/questions/${problem.id}`)">
                  {{ problem.id }}
                </a>
              </td>
              <td class="px-4 py-3">{{ problem.title }}</td>
              <td class="px-4 py-3">
                <span :class="`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(problem.difficulty)}`">
                  {{ problem.difficulty }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in problem.tags" :key="tag" class="px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {{ tag }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3">{{ problem.createdBy }}</td>
              <td class="px-4 py-3">{{ problem.createdAt }}</td>
              <td class="px-4 py-3">
                {{ Math.round(problem.acceptedCount / problem.submissionCount * 100) }}%
                <span class="text-xs text-neutral-600 dark:text-neutral-400">
                  ({{ problem.acceptedCount }}/{{ problem.submissionCount }})
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="{
                  'px-2 py-0.5 rounded-full text-xs': true,
                  'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': problem.status === '公开',
                  'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200': problem.status === '私有'
                }">
                  {{ problem.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <fluent-button appearance="lightweight" size="small" @click="router.push(`/workspace/questions/edit/${problem.id}`)">
                    <Icon icon="fluent:edit-20-regular" class="w-4 h-4" />
                  </fluent-button>
                  <fluent-button appearance="lightweight" size="small" @click="router.push(`/questions/status/${problem.id}`)">
                    <Icon icon="fluent:data-trending-20-regular" class="w-4 h-4" />
                  </fluent-button>
                  <fluent-button 
                    appearance="lightweight" 
                    size="small"
                    :class="problem.status === '公开' ? 'text-orange-600' : 'text-green-600'"
                    @click="problem.status = problem.status === '公开' ? '私有' : '公开'"
                  >
                    <Icon 
                      :icon="problem.status === '公开' ? 'fluent:eye-off-20-regular' : 'fluent:eye-20-regular'" 
                      class="w-4 h-4" 
                    />
                  </fluent-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </fluent-card>

    <!-- 分页 -->
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-neutral-600 dark:text-neutral-400">
        显示第 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalProblems) }} 条，共 {{ totalProblems }} 条
      </div>
      <div class="flex gap-1">
        <fluent-button 
          appearance="lightweight" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <Icon icon="fluent:chevron-left-20-filled" class="w-5 h-5" />
        </fluent-button>
        
        <fluent-button 
          v-for="page in 5" 
          :key="page"
          appearance="lightweight"
          :class="page === currentPage ? 'bg-neutral-200 dark:bg-neutral-700' : ''"
          @click="changePage(page)"
        >
          {{ page }}
        </fluent-button>
        
        <fluent-button 
          appearance="lightweight" 
          :disabled="currentPage * pageSize >= totalProblems"
          @click="changePage(currentPage + 1)"
        >
          <Icon icon="fluent:chevron-right-20-filled" class="w-5 h-5" />
        </fluent-button>
      </div>
    </div>

    <!-- 批量操作对话框 -->
    <fluent-dialog :open="isBulkActionDialogOpen" @close="isBulkActionDialogOpen = false">
      <div slot="title">批量操作</div>
      <div class="p-6">
        <p v-if="bulkAction === 'publish'">确定要公开选中的 {{ selectedProblems.length }} 个题目吗？</p>
        <p v-else-if="bulkAction === 'unpublish'">确定要隐藏选中的 {{ selectedProblems.length }} 个题目吗？</p>
        <p v-else-if="bulkAction === 'delete'" class="text-red-600 dark:text-red-400">
          警告：此操作将永久删除选中的 {{ selectedProblems.length }} 个题目，无法恢复。
        </p>
        
        <div class="mt-6 flex justify-end gap-2">
          <fluent-button appearance="outline" @click="isBulkActionDialogOpen = false">取消</fluent-button>
          <fluent-button 
            :appearance="bulkAction === 'delete' ? 'accent' : 'primary'"
            :class="bulkAction === 'delete' ? 'bg-red-600 text-white' : ''"
            @click="executeBulkAction"
          >
            确认
          </fluent-button>
        </div>
      </div>
    </fluent-dialog>
  </div>
</template>