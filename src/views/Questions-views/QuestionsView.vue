<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import RecommendedProblems from "@/components/RecommendedProblems.vue";
import RecentSubmissions from "@/components/RecentSubmissions.vue";
document.title = "Sora Online Judge • 问题";

const router = useRouter();
//router.push("/under-construction");
</script>

<template>
    <div class="w-full">
        <RecommendedProblems title="题目" />
        <RecentSubmissions :submissions="[]" title="最近提交" />
    </div>
</template>
