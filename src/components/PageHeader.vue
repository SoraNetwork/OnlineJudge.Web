<script setup lang="ts">
import { currentTheme, switchTheme } from "@/services/ThemeService";
import { type Tablist, type Drawer } from "@fluentui/web-components";
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import IconButton from "./IconButton.vue";
import { changeFavicon } from "@/utils/utils";
const router = useRouter();

const headerIcon = ref<string>("/Noir.png");
const header = ref<string>("Sora Online Judge");

// 添加鼠标悬浮处理函数
const handleMouseEnter = () => {
  headerIcon.value = "/Noir_wink.png";
};

const handleMouseLeave = () => {
  headerIcon.value = "/Noir.png";
};

onMounted(() => {
  var navigation = document.getElementById("navigation");
  var tablist = navigation as Tablist;
  var baseMethod = tablist.activeidChanged;
  var path = location.pathname.substring(1);

  if (path != "" && !router.hasRoute(path))
    tablist.activeid = "not-found-table";
  else tablist.activeid = path + "-table";

  tablist.activeidChanged = function (oldValue: string, newValue: string) {
    baseMethod.call(tablist, oldValue, newValue);
    navigate("/" + newValue.replace("-table", ""));
  };
});

const navigationOpenClick = () => {
  var drawer = document.getElementById("drawer-default");
  (drawer as Drawer).show();
};

const navigationCloseClick = () => {
  var drawer = document.getElementById("drawer-default");
  (drawer as Drawer).hide();
};

router.beforeEach((to, from, next) => {
  next();
});

function navigate(path: string) {
  window.scrollTo(0, 0);
  router.push(path);
}
</script>

<template>
  <header
    class="px-4 py-4 flex items-center gap-4 bg-neutral-100/80 dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-800 border-b-1 backdrop-blur-lg"
  >
    <div class="flex gap-4">
      <div class="flex gap-4 flex-none items-center">
        <img
          class="border-1 border-neutral-600 rounded-sm w-10 h-10"
          :src="headerIcon"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
          @click="navigate('/')"
        />
        <p
          class="text-xl select-none font-semibold text-neutral-700 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-300 transition"
          v-text="header"
          @click="navigate('/')"
        ></p>
      </div>


      <div
        style="height: 32px; width: 0.5px"
        class="bg-neutral-300 dark:bg-neutral-700 hidden sm:flex"
      />

      <nav class="sm:flex hidden">
        <ul class="flex gap-2">
          <RouterLink
            to="/"
            class="flex rounded-sm hover:bg-neutral-200 active:bg-neutral-200 dark:hover:bg-neutral-700 dark:active:bg-neutral-700 active:text-blue-900 dark:active:text-blue-300 transition"
            active-class="flex rounded-sm bg-neutral-200 dark:bg-neutral-700 text-blue-800 dark:text-blue-200"
          >
            <li
              class="flex justify-center items-center gap-1 px-2.5 rounded-sm select-none"
            >
              <Icon icon="fluent:home-20-regular" class="w-5 h-5" />
              <p>主页</p>
            </li>
          </RouterLink>

          <RouterLink
            to="/projects"
            class="flex rounded-sm hover:bg-neutral-200 active:bg-neutral-200 dark:hover:bg-neutral-700 dark:active:bg-neutral-700 active:text-blue-900 dark:active:text-blue-300 transition"
            active-class="flex rounded-sm bg-neutral-200 dark:bg-neutral-700 text-blue-800 dark:text-blue-200"
          >
            <li
              class="flex justify-center items-center gap-1 px-2.5 rounded-sm select-none"
            >
              <Icon icon="fluent:apps-20-filled" class="w-5 h-5" />
              <p>项目</p>
            </li>
          </RouterLink>

          <RouterLink
            to="/news"
            class="flex rounded-sm hover:bg-neutral-200 active:bg-neutral-200 dark:hover:bg-neutral-700 dark:active:bg-neutral-700 active:text-blue-900 dark:active:text-blue-300 transition"
            active-class="flex rounded-sm bg-neutral-200 dark:bg-neutral-700 text-blue-800 dark:text-blue-200"
          >
            <li
              class="flex justify-center items-center gap-1 px-2.5 rounded-sm select-none"
            >
              <Icon icon="fluent:news-20-regular" class="w-5 h-5" />
              <p>消息</p>
            </li>
          </RouterLink>
        </ul>
      </nav>
    </div>

    <div class="flex grow"></div>

    <div class="flex justify-end flex-auto gap-2">
      <fluent-menu>
        <fluent-menu-button
          id="theme-button"
          class="min-w-0 px-2 py-1.5 rounded-sm transition bg-transparent dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          slot="trigger"
          size="small"
        >
          <Icon slot="end" icon="fluent:dark-theme-20-filled" class="w-5 h-5" />
        </fluent-menu-button>

        <fluent-menu-list
          style="margin-left: -36px"
          class="min-w-4 rounded-md gap-1 p-1 mt-2 backdrop-blur-md bg-neutral-100/80 dark:bg-neutral-800/80"
        >
          <fluent-menu-item
            @click="() => switchTheme('auto')"
            class="bg-transparent pl-2 pr-5 dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            role="menuitemradio"
            :checked="currentTheme == 'auto'"
            >跟随系统</fluent-menu-item
          >
          <fluent-menu-item
            @click="() => switchTheme('light')"
            class="bg-transparent pl-2 pr-5 dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            role="menuitemradio"
            :checked="currentTheme == 'light'"
            >亮色</fluent-menu-item
          >
          <fluent-menu-item
            @click="() => switchTheme('dark')"
            class="bg-transparent pl-2 pr-5 dark:text-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            role="menuitemradio"
            :checked="currentTheme == 'dark'"
            >暗色</fluent-menu-item
          >
        </fluent-menu-list>
      </fluent-menu>

      <div class="gap-2 justify-end sm:flex hidden">
        <IconButton
          Glyph="fluent:warning-20-filled"
          ToolTip="报告问题"
          href="https://github.com/Xcube-Studio/Studio-Official-Website/issues"
        />
        <IconButton
          Glyph="fluent:code-20-regular"
          ToolTip="网站仓库"
          href="https://github.com/Xcube-Studio/Studio-Official-Website"
        />
      </div>

      <div
        class="justify-end flex sm:hidden items-center gap-2 rounded-sm select-none transition"
      >
        <fluent-button
          id="navigation-open-button"
          style="min-width: 0"
          class="w-10 bg-transparent rounded-sm transition hover:bg-neutral-200 dark:hover:bg-neutral-700"
          @click="navigationOpenClick"
        >
          <Icon icon="fluent:navigation-20-regular" />
        </fluent-button>
        <fluent-tooltip
          positioning="below"
          anchor="navigation-open-button"
          class="p-2 mt-2"
        >
          打开导航
        </fluent-tooltip>
      </div>

      <div class="fixed">
        <fluent-drawer
          id="drawer-default"
          position="end"
          size="small"
          type="modal"
          class="rounded-tl-sm rounedd-bl-sm"
        >
          <fluent-drawer-body class="dark:bg-neutral-900">
            <div class="p-1 flex bg-neutral-100 dark:bg-neutral-800">
              <div class="gap-2 py-3 px-3 flex justify-start">
                <IconButton
                  Glyph="fluent:warning-20-filled"
                  ToolTip="报告问题"
                  href="https://github.com/Xcube-Studio/Studio-Official-Website/issues"
                />
                <IconButton
                  Glyph="fluent:code-20-regular"
                  ToolTip="网站仓库"
                  href="https://github.com/Xcube-Studio/Studio-Official-Website"
                />
              </div>
              <div class="grow" />
              <div class="py-3 px-3 flex justify-end">
                <fluent-button
                  id="navigation-close-button"
                  style="min-width: 0"
                  class="w-10 bg-transparent rounded-sm transition hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  @click="navigationCloseClick"
                >
                  <Icon icon="fluent:navigation-20-regular" />
                </fluent-button>
                <fluent-tooltip
                  positioning="below"
                  anchor="navigation-close-button"
                  class="p-2 mt-2"
                >
                  关闭导航
                </fluent-tooltip>
              </div>
            </div>
            <fluent-divider />
            <div class="p-1">
              <fluent-tablist
                id="navigation"
                class="gap-1"
                orientation="vertical"
                size="large"
              >
                <fluent-tab
                  id="-table"
                  class="h-8 py-5 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <li
                    class="font-normal flex justify-center items-center gap-2 px-2.5 rounded-sm select-none"
                  >
                    <Icon icon="fluent:home-32-regular" class="w-5 h-5" />
                    <p>主页</p>
                  </li>
                </fluent-tab>
                <fluent-tab
                  id="projects-table"
                  class="h-8 py-5 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <li
                    class="font-normal flex justify-center items-center gap-2 px-2.5 rounded-sm select-none"
                  >
                    <Icon icon="fluent:apps-32-filled" class="w-5 h-5" />
                    <p>项目</p>
                  </li>
                </fluent-tab>
                <fluent-tab
                  id="news-table"
                  class="h-8 py-5 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <li
                    class="font-normal flex justify-center items-center gap-2 px-2.5 rounded-sm select-none"
                  >
                    <Icon icon="fluent:news-28-regular" class="w-5 h-5" />
                    <p>消息</p>
                  </li>
                </fluent-tab>
                <fluent-tab id="not-found-table" class="hidden"> </fluent-tab>
              </fluent-tablist>
              <div></div>
            </div>
          </fluent-drawer-body>
        </fluent-drawer>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
