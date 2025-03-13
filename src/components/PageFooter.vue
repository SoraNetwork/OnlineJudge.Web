<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import HyperlinkButton from "./HyperlinkButton.vue";
import IconButton from "./IconButton.vue";

const router = useRouter();
const footerIcon = ref<string>("/Noir.png");

function navigate(path: string) {
  window.scrollTo(0, 0);
  router.push(path);
}

const handleMouseEnter = () => {
  footerIcon.value = "/Noir_wink.png";
};

const handleMouseLeave = () => {
  footerIcon.value = "/Noir.png";
};
</script>

<template>
  <footer
    class="bg-neutral-100 dark:bg-neutral-900 border-t-neutral-200 dark:border-t-neutral-800 border-t-1 p-8 md:p-16"
  >
    <div class="flex flex-col flex-wrap md:flex-row gap-8 md:gap-32">
      <div class="flex flex-col gap-4">
        <div class="flex gap-4 flex-none items-center">
          <img
            class="border-1 border-neutral-500 dark:border-neutral-600 rounded-sm w-15 h-15"
            :src="footerIcon"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            @click="navigate('/')"
          />
          <p
            class="text-3xl select-none font-semibold text-neutral-700 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-300 transition"
            @click="navigate('/')"
          >
            Sora Online Judge
          </p>
        </div>

        <div class="flex gap-2">
          <IconButton
            href="https://github.com/xingxing2008"
            Glyph="mdi:github"
            ToolTip="GitHub"
          />
          <IconButton
            href="mailto:xingxing520@axing6.cn"
            Glyph="fluent:mail-20-filled"
            ToolTip="邮箱"
          />
          <IconButton
            href="https://qm.qq.com/q/8AKSiUUrn2"
            Glyph="ri:qq-fill"
            ToolTip="QQ 群"
          />
        </div>
        <p
          class="text-md select-none font-semibold text-neutral-500 dark:text-neutral-400"
        >
          Copyright © 2024 Sora Online Judge
        </p>
        <a class="text-md select-none font-semibold text-neutral-500 dark:text-neutral-400" href="http://beian.miit.gov.cn/">
          浙ICP备2024113182号-1
        </a>

      </div>
      <div class="flex md:flex-auto flex-col gap-2 items-start">
        <p
          class="text-md select-none text-neutral-600 hover:text-neutral-400 dark:text-neutral-300 dark:hover:text-neutral-50 transition"
        >
          导航
        </p>
        <div class="flex flex-col gap-2 items-start" style="margin-left: -12px">
          <HyperlinkButton Content="主页" :OnClick="() => navigate('/')" />
          <HyperlinkButton Content="题目" :OnClick="() => navigate('/questions')" />
          <HyperlinkButton Content="竞赛" :OnClick="() => navigate('/contests')" />
          <HyperlinkButton Content="工作台" :OnClick="() => navigate('/workspace')" />
        </div>
      </div>
      <div class="flex md:flex-auto flex-col gap-2 items-start">
        <p
          class="text-md select-none text-neutral-600 hover:text-neutral-400 dark:text-neutral-300 dark:hover:text-neutral-50 transition"
        >
          资源
        </p>
        <div class="flex flex-col gap-2 items-start" style="margin-left: -12px">
          <HyperlinkButton
            Content="算法学习"
            href="https://oi-wiki.org/"
          />
          <HyperlinkButton
            Content="评测状态"
            :OnClick="() => navigate('/questions/status/all')"
          />
          <HyperlinkButton
            Content="帮助文档"
            href="#"
          />
        </div>
      </div>
      <div class="flex md:flex-auto flex-col gap-2 items-start">
        <p
          class="text-md select-none text-neutral-600 hover:text-neutral-400 dark:text-neutral-300 dark:hover:text-neutral-50 transition"
        >
          关于
        </p>
        <div class="flex flex-col gap-2 items-start" style="margin-left: -12px">
          <HyperlinkButton
            Content="关于我们"
            href="#"
          />
          <HyperlinkButton
            Content="使用条款"
            href="#"
          />
          <HyperlinkButton
            Content="隐私政策"
            :OnClick="() => navigate('/privacy')"
          />
        </div>
      </div>
    </div>
  </footer>
</template>
