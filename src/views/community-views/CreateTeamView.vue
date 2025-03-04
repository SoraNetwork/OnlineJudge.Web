<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

document.title = "Sora Online Judge • 创建团队";

const router = useRouter();
const teamName = ref('');
const teamDescription = ref('');
const isPublic = ref(true);
const isSubmitting = ref(false);

const handleCreateTeam = async () => {
  try {
    isSubmitting.value = true;
    // 这里添加创建团队的API调用
    console.log('创建团队：', {
      name: teamName.value,
      description: teamDescription.value,
      isPublic: isPublic.value
    });
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    router.push('/teams');
  } catch (error) {
    console.error('创建团队失败', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col px-6 py-8 max-w-3xl mx-auto">
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-1">
        <fluent-button appearance="subtle" @click="router.back()" class="p-1">
          <Icon icon="fluent:arrow-left-20-regular" class="w-5 h-5" />
        </fluent-button>
        <h1 class="text-2xl font-bold">创建新团队</h1>
      </div>
      <p class="text-neutral-600 dark:text-neutral-400">创建一个团队，邀请成员并一起解决问题</p>
    </div>

    <fluent-card class="p-6">
      <form @submit.prevent="handleCreateTeam" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="team-name" class="font-medium">团队名称</label>
          <fluent-text-field id="team-name" v-model="teamName" placeholder="输入团队名称" appearance="outline" required />
        </div>

        <div class="flex flex-col gap-2">
          <label for="team-description" class="font-medium">团队介绍</label>
          <fluent-text-area id="team-description" v-model="teamDescription" placeholder="描述你的团队目标和特点" rows="4" appearance="outline" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium">团队类型</label>
          <div class="flex gap-4">
            <fluent-radio checked @change="isPublic = true">公开团队</fluent-radio>
            <fluent-radio @change="isPublic = false">私密团队</fluent-radio>
          </div>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ isPublic ? '公开团队可被所有人搜索和查看' : '私密团队只对成员可见，需通过邀请加入' }}
          </p>
        </div>

        <div class="flex justify-end mt-4">
          <fluent-button appearance="outline" @click="router.back()" class="mr-2">取消</fluent-button>
          <fluent-button appearance="accent" type="submit" :disabled="isSubmitting">
            <Icon v-if="isSubmitting" icon="fluent:spinner-ios-20-regular" class="w-5 h-5 mr-2 animate-spin" />
            {{ isSubmitting ? '创建中...' : '创建团队' }}
          </fluent-button>
        </div>
      </form>
    </fluent-card>
  </div>
</template>
