<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { isLoggedIn } from '@/stores/userStore';

document.title = "Sora Online Judge • 我的团队";

const router = useRouter();

const activeTeams = ref([
  {
    id: 1,
    name: "ACM 校队",
    avatar: "",
    members: 25,
    description: "校 ACM 竞赛队，专注于算法竞赛训练",
    tags: ["竞赛", "算法"],
    leader: "tourist",
    joinDate: "2023-12-01"
  },
  {
    id: 2,
    name: "算法学习小组",
    avatar: "",
    members: 15,
    description: "每周算法研讨和习题讲解",
    tags: ["学习", "讨论"],
    leader: "jiangly",
    joinDate: "2024-01-15"
  }
]);

const recommendedTeams = ref([
  {
    id: 3,
    name: "前端技术社区",
    avatar: "",
    members: 120,
    description: "专注Web前端技术交流与分享",
    tags: ["前端", "技术"],
    leader: "XingSora"
  },
  {
    id: 4,
    name: "机器学习研究组",
    avatar: "",
    members: 45,
    description: "AI算法与应用研究",
    tags: ["AI", "算法"],
    leader: "tourist"
  }
]);

const getInitials = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

const navigate = (path: string) => {
  window.scrollTo(0, 0);
  router.push(path);
};

const createTeam = () => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  // 导航到创建团队页面
  router.push('/teams/create');
};
</script>

<template>
  <div class="flex flex-col p-8 gap-6">
    <!-- 顶部操作栏 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">我的团队</h1>
      <fluent-button appearance="accent" @click="createTeam">
        <Icon icon="fluent:people-team-add-20-filled" class="w-5 h-5 mr-2" />
        创建团队
      </fluent-button>
    </div>

    <div class="flex flex-col gap-6">
      <!-- 已加入的团队 -->
      <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
        <h2 class="text-xl font-bold mb-4">已加入的团队</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="team in activeTeams" :key="team.id"
            class="p-6 rounded-lg border-1 border-neutral-200 dark:border-neutral-700 hover:border-blue-500 cursor-pointer transition-colors"
            @click="router.push(`/teams/${team.id}`)">
            <div class="flex gap-4">
              <!-- 团队头像 -->
              <div class="w-12 h-12">
                <div v-if="team.avatar" class="w-full h-full">
                  <fluent-avatar :image="team.avatar" :title="team.name" />
                </div>
                <div v-else class="w-full h-full">
                  <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-lg font-medium">
                    {{ getInitials(team.name) }}
                  </fluent-badge>
                </div>
              </div>

              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-medium">{{ team.name }}</h3>
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ team.members }} 成员</span>
                </div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{{ team.description }}</p>
                
                <div class="flex gap-2 mt-3">
                  <fluent-badge v-for="tag in team.tags" :key="tag" appearance="outline" class="px-2 py-1">
                    {{ tag }}
                  </fluent-badge>
                </div>

                <div class="flex justify-between items-center mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <span class="flex items-center gap-1">
                    <Icon icon="fluent:person-20-regular" />
                    团队领队: {{ team.leader }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon icon="fluent:calendar-20-regular" />
                    加入时间: {{ team.joinDate }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐团队 -->
      <div class="rounded-lg border-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6">
        <h2 class="text-xl font-bold mb-4">推荐团队</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="team in recommendedTeams" :key="team.id"
            class="p-6 rounded-lg border-1 border-neutral-200 dark:border-neutral-700 hover:border-blue-500 cursor-pointer transition-colors"
            @click="router.push(`/teams/${team.id}`)">
            <div class="flex gap-4">
              <!-- 团队头像 -->
              <div class="w-12 h-12">
                <div v-if="team.avatar" class="w-full h-full">
                  <fluent-avatar :image="team.avatar" :title="team.name" />
                </div>
                <div v-else class="w-full h-full">
                  <fluent-badge appearance="accent" class="w-full h-full flex items-center justify-center text-lg font-medium">
                    {{ getInitials(team.name) }}
                  </fluent-badge>
                </div>
              </div>

              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-medium">{{ team.name }}</h3>
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ team.members }} 成员</span>
                </div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{{ team.description }}</p>
                
                <div class="flex gap-2 mt-3">
                  <fluent-badge v-for="tag in team.tags" :key="tag" appearance="outline" class="px-2 py-1">
                    {{ tag }}
                  </fluent-badge>
                </div>

                <div class="flex justify-between items-center mt-4">
                  <span class="text-sm text-neutral-600 dark:text-neutral-400">
                    团队领队: {{ team.leader }}
                  </span>
                  <fluent-button appearance="accent">
                    申请加入
                  </fluent-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
