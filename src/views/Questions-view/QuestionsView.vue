<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import RecommendedProblems from "@/components/RecommendedProblems.vue";
import RecentSubmissions from "@/components/RecentSubmissions.vue";
document.title = "Sora Online Judge • 问题";

const router = useRouter();
</script>

<template>
  <div class="container mx-auto px-4 py-6 dark:bg-gray-800 min-h-[95vh]">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧题目列表 -->
      <div class="lg:col-span-2">
        <RecommendedProblems title="题目"/>
      </div>
      
      <!-- 右侧最近提交 -->
      <div class="lg:col-span-1">
        <RecentSubmissions :showViewAllButton="true" :submissions="[]" title="最近提交"/>
      </div>
    </div>
  </div>
</template>

