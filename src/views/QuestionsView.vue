<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import RecommendedProblems from "@/components/RecommendedProblems.vue";
document.title = "Sora Online Judge • 问题";

const router = useRouter();
//router.push("/under-construction");
</script>

<template>
    <RecommendedProblems title="题目"/>
</template>
