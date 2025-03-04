<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { userInfo, hasPermission } from '@/stores/userStore';

document.title = "Sora Online Judge • 工作台";

const router = useRouter();

// 用户角色状态，基于权限判断
const isAdminUser = ref(false);
const isTeamManagerUser = ref(false);

// 模拟数据，实际使用时应该从API获取
const recentProblems = ref([
  { id: 'P1001', title: 'A + B Problem', difficulty: '入门', lastVisited: '2024-01-15' },
  { id: 'P1002', title: '过河卒', difficulty: '简单', lastVisited: '2024-01-14' },
  { id: 'P1003', title: '铺地毯', difficulty: '中等', lastVisited: '2024-01-13' }
]);

const userTeams = ref([
  { id: 1, name: '算法竞赛小队', role: '管理员', memberCount: 15 },
  { id: 2, name: 'ACM集训队', role: '成员', memberCount: 32 }
]);

// 检查用户权限
/*onMounted(() => {
  isAdminUser.value = isAdmin();
  isTeamManagerUser.value = isTeamAdmin();
}); */

const navigate = (path: string) => {
  window.scrollTo(0, 0);
  router.push(path);
};
</script>

<template>
  <div class="flex flex-col px-6 py-8 max-w-7xl mx-auto">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">工作台</h1>
      <p class="text-neutral-600 dark:text-neutral-400">管理您的题目、比赛和团队</p>
    </div>

    <!-- 管理员功能区 -->
    <section v-if="isAdminUser" class="mb-8">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <Icon icon="fluent:shield-20-filled" class="w-5 h-5 text-red-600" />
        管理员功能
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <fluent-card class="p-6 cursor-pointer hover:border-blue-500 transition-colors" @click="navigate('/workspace/admin/users')">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Icon icon="fluent:people-20-filled" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-lg font-medium">用户管理</h3>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400">管理系统用户、权限和账户设置</p>
        </fluent-card>

        <fluent-card class="p-6 cursor-pointer hover:border-blue-500 transition-colors">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-md bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Icon icon="fluent:settings-20-filled" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-lg font-medium">系统设置</h3>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400">配置系统参数、安全性和服务选项</p>
        </fluent-card>

        <fluent-card class="p-6 cursor-pointer hover:border-blue-500 transition-colors">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Icon icon="fluent:data-trending-20-filled" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-lg font-medium">系统监控</h3>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400">查看系统状态、资源使用和访问统计</p>
        </fluent-card>
      </div>
    </section>

    <!-- 团队管理功能区 -->
    <section v-if="isTeamManagerUser" class="mb-8">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <Icon icon="fluent:people-team-20-filled" class="w-5 h-5 text-blue-600" />
        团队管理
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <fluent-card v-for="team in userTeams" :key="team.id" 
          class="p-6 cursor-pointer hover:border-blue-500 transition-colors"
          @click="navigate(`/teams/${team.id}/manage`)" 
          v-show="team.role === '管理员'">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Icon icon="fluent:people-team-20-filled" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-lg font-medium">{{ team.name }}</h3>
              <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">{{ team.memberCount }} 成员</span>
            </div>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400">管理团队成员、权限和设置</p>
        </fluent-card>
      </div>
    </section>

    <!-- 创建内容功能区 -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <Icon icon="fluent:add-square-20-filled" class="w-5 h-5 text-green-600" />
        创建内容
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <fluent-card class="p-6 cursor-pointer hover:border-blue-500 transition-colors" @click="navigate('/workspace/questions/create')">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Icon icon="fluent:book-question-mark-20-filled" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-lg font-medium">创建题目</h3>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400">创建新的编程题目，设置测试用例和难度</p>
        </fluent-card>

        <fluent-card class="p-6 cursor-pointer hover:border-blue-500 transition-colors" @click="navigate('/workspace/contests/create')">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-md bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Icon icon="fluent:calendar-add-20-filled" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 class="text-lg font-medium">创建比赛</h3>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400">创建编程比赛，设置题目、时间和参与规则</p>
        </fluent-card>

        <fluent-card class="p-6 cursor-pointer hover:border-blue-500 transition-colors" @click="navigate('/teams/create')">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <Icon icon="fluent:people-team-add-20-filled" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 class="text-lg font-medium">创建团队</h3>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400">创建新的团队，邀请成员和设置团队信息</p>
        </fluent-card>
      </div>
    </section>

    <!-- 最近题目 -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <Icon icon="fluent:history-20-filled" class="w-5 h-5 text-purple-600" />
        最近做题记录
      </h2>
      <fluent-data-grid>
        <fluent-data-grid-row row-type="header">
          <fluent-data-grid-cell cell-type="columnheader" grid-column="1">题目ID</fluent-data-grid-cell>
          <fluent-data-grid-cell cell-type="columnheader" grid-column="2">题目名称</fluent-data-grid-cell>
          <fluent-data-grid-cell cell-type="columnheader" grid-column="3">难度</fluent-data-grid-cell>
          <fluent-data-grid-cell cell-type="columnheader" grid-column="4">最近访问</fluent-data-grid-cell>
          <fluent-data-grid-cell cell-type="columnheader" grid-column="5">操作</fluent-data-grid-cell>
        </fluent-data-grid-row>
        <fluent-data-grid-row v-for="problem in recentProblems" :key="problem.id">
          <fluent-data-grid-cell grid-column="1">{{ problem.id }}</fluent-data-grid-cell>
          <fluent-data-grid-cell grid-column="2">{{ problem.title }}</fluent-data-grid-cell>
          <fluent-data-grid-cell grid-column="3">
            <span :class="{
              'px-2 py-0.5 rounded-full text-xs': true,
              'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': problem.difficulty === '入门',
              'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200': problem.difficulty === '简单',
              'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200': problem.difficulty === '中等',
              'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200': problem.difficulty === '困难'
            }">
              {{ problem.difficulty }}
            </span>
          </fluent-data-grid-cell>
          <fluent-data-grid-cell grid-column="4">{{ problem.lastVisited }}</fluent-data-grid-cell>
          <fluent-data-grid-cell grid-column="5">
            <div class="flex gap-2">
              <fluent-button appearance="accent" @click="navigate(`/questions/${problem.id}`)" size="small">
                查看
              </fluent-button>
              <fluent-button appearance="outline" @click="navigate(`/questions/${problem.id}/submit`)" size="small">
                提交
              </fluent-button>
            </div>
          </fluent-data-grid-cell>
        </fluent-data-grid-row>
      </fluent-data-grid>
    </section>

    <!-- 我的团队 -->
    <section>
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <Icon icon="fluent:people-team-20-filled" class="w-5 h-5 text-cyan-600" />
        我的团队
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <fluent-card v-for="team in userTeams" :key="team.id" 
          class="p-6 cursor-pointer hover:border-blue-500 transition-colors"
          @click="navigate(`/teams/${team.id}`)">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-md bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
              <Icon icon="fluent:people-team-20-filled" class="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 class="text-lg font-medium">{{ team.name }}</h3>
              <div class="flex gap-2 mt-1">
                <span class="text-xs bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-2 py-0.5 rounded-full">{{ team.role }}</span>
                <span class="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded-full">{{ team.memberCount }} 成员</span>
              </div>
            </div>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400">查看团队活动、比赛和讨论</p>
        </fluent-card>

        <fluent-card class="p-6 border-dashed cursor-pointer hover:border-blue-500 transition-colors"
          @click="navigate('/teams/create')">
          <div class="flex flex-col items-center justify-center h-24">
            <Icon icon="fluent:add-circle-20-regular" class="w-12 h-12 text-neutral-400 dark:text-neutral-600 mb-2" />
            <p class="text-neutral-600 dark:text-neutral-400">创建新团队</p>
          </div>
        </fluent-card>
      </div>
    </section>
  </div>
</template>
