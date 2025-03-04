<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

document.title = "Sora Online Judge • 团队管理";

const router = useRouter();
const route = useRoute();
const teamId = route.params.id;

// 模拟数据
const team = ref({
    id: teamId,
    name: '算法竞赛小队',
    description: '专注于算法竞赛训练和准备的小团队，欢迎有志于参加ACM-ICPC的同学加入！',
    createdAt: '2023-12-15',
    memberCount: 15,
    isPublic: true
});

const members = ref([
    { id: 1, username: 'alice', nickname: 'Alice', role: '管理员', joinDate: '2023-12-15' },
    { id: 2, username: 'bob', nickname: 'Bob', role: '成员', joinDate: '2023-12-16' },
    { id: 3, username: 'charlie', nickname: 'Charlie', role: '成员', joinDate: '2023-12-17' }
]);

const teamContests = ref([
    { id: 1, title: '团队周赛 #1', startTime: '2024-03-15 19:00', status: '即将开始' },
    { id: 2, title: '算法基础训练', startTime: '2024-02-28 14:00', status: '已结束' }
]);

const activeTab = ref('members');

onMounted(() => {
    // 这里可以添加获取团队信息的API调用
});

const removeUser = (userId: number) => {
    if (confirm('确定要移除该成员吗？')) {
        members.value = members.value.filter(member => member.id !== userId);
    }
};

const changeRole = (userId: number, newRole: string) => {
    const index = members.value.findIndex(member => member.id === userId);
    if (index !== -1) {
        members.value[index].role = newRole;
    }
};

const saveSettings = () => {
    // 保存团队设置的逻辑
    alert('团队设置已保存！');
};

const createContest = () => {
    router.push(`/workspace/contests/create?team=${teamId}`);
};
</script>

<template>
    <div class="flex flex-col px-6 py-8 max-w-7xl mx-auto">
        <div class="mb-6">
            <div class="flex items-center gap-2 mb-1">
                <fluent-button appearance="subtle" @click="router.push(`/teams/${teamId}`)" class="p-1">
                    <Icon icon="fluent:arrow-left-20-regular" class="w-5 h-5" />
                </fluent-button>
                <h1 class="text-2xl font-bold">{{ team.name }} - 团队管理</h1>
            </div>
            <p class="text-neutral-600 dark:text-neutral-400">管理团队成员、设置和比赛</p>
        </div>

        <fluent-tabs>
            <fluent-tab id="members-tab" @click="activeTab = 'members'" :selected="activeTab === 'members'">成员管理</fluent-tab>
            <fluent-tab id="settings-tab" @click="activeTab = 'settings'" :selected="activeTab === 'settings'">团队设置</fluent-tab>
            <fluent-tab id="contests-tab" @click="activeTab = 'contests'" :selected="activeTab === 'contests'">团队比赛</fluent-tab>
            
            <fluent-tab-panel id="members-panel" v-show="activeTab === 'members'">
                <div class="mt-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-semibold">成员列表</h3>
                        <fluent-button appearance="accent">
                            <Icon icon="fluent:person-add-20-filled" class="w-5 h-5 mr-2" />
                            邀请成员
                        </fluent-button>
                    </div>
                    
                    <fluent-data-grid>
                        <fluent-data-grid-row row-type="header">
                            <fluent-data-grid-cell cell-type="columnheader" grid-column="1">用户名</fluent-data-grid-cell>
                            <fluent-data-grid-cell cell-type="columnheader" grid-column="2">昵称</fluent-data-grid-cell>
                            <fluent-data-grid-cell cell-type="columnheader" grid-column="3">角色</fluent-data-grid-cell>
                            <fluent-data-grid-cell cell-type="columnheader" grid-column="4">加入日期</fluent-data-grid-cell>
                            <fluent-data-grid-cell cell-type="columnheader" grid-column="5">操作</fluent-data-grid-cell>
                        </fluent-data-grid-row>
                        
                        <fluent-data-grid-row v-for="member in members" :key="member.id">
                            <fluent-data-grid-cell grid-column="1">
                                <a class="text-blue-600 hover:underline cursor-pointer" @click="router.push(`/profile/${member.username}`)">
                                    {{ member.username }}
                                </a>
                            </fluent-data-grid-cell>
                            <fluent-data-grid-cell grid-column="2">{{ member.nickname }}</fluent-data-grid-cell>
                            <fluent-data-grid-cell grid-column="3">
                                <span :class="{
                                    'px-2 py-0.5 rounded-full text-xs': true,
                                    'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200': member.role === '管理员',
                                    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': member.role === '成员'
                                }">
                                    {{ member.role }}
                                </span>
                            </fluent-data-grid-cell>
                            <fluent-data-grid-cell grid-column="4">{{ member.joinDate }}</fluent-data-grid-cell>
                            <fluent-data-grid-cell grid-column="5">
                                <div class="flex gap-2">
                                    <fluent-button appearance="outline" size="small" 
                                        @click="changeRole(member.id, member.role === '管理员' ? '成员' : '管理员')"
                                        v-if="member.id !== 1">
                                        {{ member.role === '管理员' ? '设为成员' : '设为管理员' }}
                                    </fluent-button>
                                    <fluent-button appearance="outline" size="small" @click="removeUser(member.id)" v-if="member.id !== 1">
                                        <Icon icon="fluent:delete-20-regular" class="w-4 h-4" />
                                    </fluent-button>
                                </div>
                            </fluent-data-grid-cell>
                        </fluent-data-grid-row>
                    </fluent-data-grid>
                </div>
            </fluent-tab-panel>
            
            <fluent-tab-panel id="settings-panel" v-show="activeTab === 'settings'">
                <div class="mt-4">
                    <h3 class="text-xl font-semibold mb-4">团队设置</h3>
                    <fluent-card class="p-6">
                        <form @submit.prevent="saveSettings" class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <label for="team-name" class="font-medium">团队名称</label>
                                <fluent-text-field id="team-name" v-model="team.name" placeholder="输入团队名称" appearance="outline" required />
                            </div>
                            
                            <div class="flex flex-col gap-2">
                                <label for="team-description" class="font-medium">团队介绍</label>
                                <fluent-text-area id="team-description" v-model="team.description" rows="4" appearance="outline" />
                            </div>
                            
                            <div class="flex flex-col gap-2">
                                <label class="font-medium">团队类型</label>
                                <div class="flex gap-4">
                                    <fluent-radio :checked="team.isPublic" @change="team.isPublic = true">公开团队</fluent-radio>
                                    <fluent-radio :checked="!team.isPublic" @change="team.isPublic = false">私密团队</fluent-radio>
                                </div>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400">
                                    {{ team.isPublic ? '公开团队可被所有人搜索和查看' : '私密团队只对成员可见，需通过邀请加入' }}
                                </p>
                            </div>
                            
                            <fluent-divider />
                            
                            <div class="flex flex-col gap-2">
                                <h4 class="font-medium text-lg">危险区域</h4>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400">
                                    以下操作可能会导致不可逆的数据丢失，请谨慎操作。
                                </p>
                                
                                <div class="flex flex-col gap-2 mt-2">
                                    <fluent-button appearance="stealth" class="text-red-600 dark:text-red-400 self-start">
                                        转让团队所有权
                                    </fluent-button>
                                    <fluent-button appearance="stealth" class="text-red-600 dark:text-red-400 self-start">
                                        解散团队
                                    </fluent-button>
                                </div>
                            </div>
                            
                            <div class="flex justify-end mt-4">
                                <fluent-button appearance="accent" type="submit">保存设置</fluent-button>
                            </div>
                        </form>
                    </fluent-card>
                </div>
            </fluent-tab-panel>
            
            <fluent-tab-panel id="contests-panel" v-show="activeTab === 'contests'">
                <div class="mt-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-semibold">团队比赛</h3>
                        <fluent-button appearance="accent" @click="createContest">
                            <Icon icon="fluent:calendar-add-20-filled" class="w-5 h-5 mr-2" />
                            创建比赛
                        </fluent-button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <fluent-card v-for="contest in teamContests" :key="contest.id" 
                            class="p-6 cursor-pointer hover:border-blue-500 transition-colors"
                            @click="router.push(`/contests/${contest.id}`)">
                            <div class="flex justify-between items-start">
                                <h3 class="font-medium">{{ contest.title }}</h3>
                                <span :class="{
                                    'px-2 py-0.5 rounded-full text-xs': true,
                                    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': contest.status === '即将开始',
                                    'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200': contest.status === '进行中',
                                    'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200': contest.status === '已结束'
                                }">
                                    {{ contest.status }}
                                </span>
                            </div>
                            <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2">开始时间：{{ contest.startTime }}</p>
                            <div class="flex gap-2 mt-4">
                                <fluent-button appearance="outline" size="small" @click.stop="router.push(`/contests/${contest.id}/edit`)">
                                    编辑
                                </fluent-button>
                                <fluent-button appearance="outline" size="small" @click.stop="router.push(`/contests/${contest.id}/results`)">
                                    查看结果
                                </fluent-button>
                            </div>
                        </fluent-card>
                        
                        <fluent-card class="p-6 border-dashed flex items-center justify-center h-40 cursor-pointer hover:border-blue-500 transition-colors"
                            @click="createContest">
                            <div class="flex flex-col items-center">
                                <Icon icon="fluent:add-circle-20-regular" class="w-10 h-10 text-neutral-400 dark:text-neutral-600 mb-2" />
                                <p class="text-neutral-600 dark:text-neutral-400">创建新比赛</p>
                            </div>
                        </fluent-card>
                    </div>
                </div>
            </fluent-tab-panel>
        </fluent-tabs>
    </div>
</template>