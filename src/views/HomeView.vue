<script setup lang="ts">
import AnnounceBar from "@/components/AnnounceBar.vue";
import AtSomeOne from "@/components/AtSomeOne.vue";
import TokenItem from "@/components/TokenItem.vue";
import { Icon } from "@iconify/vue";
document.title = "Xcube Studio • 主页";

const currentWindow: Window & typeof globalThis = window;
</script>

<template>
  <div class="flex flex-col">
    <div style="min-height: 87.5vh" class="flex flex-col mb-16">
      <AnnounceBar>
        建设中...
      </AnnounceBar>
      <div class="items-center flex flex-auto flex-col gap-8 p-8 sm:mt-8">
        <div class="flex justify-center">
          <a
            class="bg-neutral-200/40 select-none text-blue-900 dark:text-blue-300 dark:bg-neutral-700/40 px-4 py-0.5 rounded-2xl font-semibold"
          >
            <p>欢迎</p>
          </a>
        </div>

        <div class="flex flex-col gap-8 grow">
          <div class="hidden h-32 md:flex"></div>
          <div class="flex flex-atuo flex-col gap-8 grow">
            <div class="flex flex-col items-center">
              <p class="font-bold text-2xl sm:text-4xl text-center">这里是</p>
              <p
                class="font-bold text-blue-900/90 dark:text-blue-300 text-3xl sm:text-5xl leading-12 sm:leading-16 text-center"
              >
                Xcube Studio 工作室
              </p>
            </div>
            <p
              class="flex text-lg text-center text-neutral-700 dark:text-neutral-400 max-w-3xl"
            >
              我们是由一群热爱 Minecraft 、并从事 Minecraft
              相关开发的开发者组成的开发团队。<br
                class="hidden sm:flex"
              />我们主要从事 C# .NET 相关开发，遵循 Fluent Design 设计理念。<br
                class="hidden sm:flex"
              />目前我们正着手 Fluent Launcher
              启动器及其附属项目的相关维护和功能开发
            </p>

            <p
              class="flex text-lg text-center justify-center text-neutral-700 dark:text-neutral-400 max-w-3xl"
            >
              我们正积极寻找着与我们志同道合的开发者加入我们 !
            </p>
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-2">
          <TokenItem Glyph="fluent:cube-20-regular" Token="Minecraft" />
          <TokenItem Glyph="fluent:code-cs-16-regular" />
          <TokenItem
            Glyph="fluent:window-dev-tools-20-regular"
            Token="Windows Develop"
          />
          <TokenItem Glyph="fluent:app-generic-20-filled" Token="Desktop" />
          <TokenItem Glyph="fluent:slide-text-20-regular" Token="MIT" />
          <TokenItem Glyph="fluent:code-20-regular" Token="Open Source" />
          <TokenItem
            Glyph="fluent:design-ideas-20-filled"
            Token="Fluent Design"
          />
        </div>
      </div>
    </div>

    <div
      class="flex flex-col p-8 sm:p-16 bg-neutral-200/30 dark:bg-neutral-800/30 gap-4"
    >
      <p class="flex text-center font-bold text-3xl sm:text-5xl sm:leading-16">
        热门项目
      </p>

      <div
        class="overflow-hidden flex flex-col sm:flex-row rounded-lg border-1 hover:shadow-lg border-neutral-300 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-800 gap-2 p-8 hover:border-blue-800 transition dark:hover:border-blue-200"
      >
        <div class="grow max-w-32"></div>
        <div class="flex flex-col gap-2 sm:gap-4 md:pl-8 justify-center">
          <a
            href="https://apps.microsoft.com/detail/9P4NQQXQ942P?hl=zh-cn&gl=CN&ocid=pdpshare"
            class="font-semibold text-xl sm:text-2xl hover:underline text-blue-900 dark:text-blue-300 select-none"
          >
            <p>Fluent Launcher 启动器</p>
          </a>

          <p
            class="flex flex-auto md:flex-none text-md sm:text-lg text-neutral-700 dark:text-neutral-400 max-w-3xl"
          >
            基于 .NET 8 以及 WinUI3 技术开发的 Minecraft Java 版启动器 <br />
            专为 Windows 11 设计的 Minecraft 启动器 <br />
            提供简洁、流畅的视觉体验
          </p>

          <div class="flex flex-wrap justify-left gap-2 max-w-100 mt-4">
            <TokenItem
              Glyph="fluent:store-microsoft-20-filled"
              Token="Microsoft Store"
              href="https://apps.microsoft.com/detail/9P4NQQXQ942P?hl=zh-cn&gl=CN&ocid=pdpshare"
            />
            <TokenItem
              href="https://github.com/Xcube-Studio/Natsurainko.FluentLauncher"
              Glyph="mdi:github"
              Token="GitHub"
            />
            <TokenItem
              href="https://github.com/Xcube-Studio/Natsurainko.FluentLauncher/stargazers"
              Glyph="fluent:star-20-filled"
              Token="300+"
            />
            <TokenItem
              href="https://github.com/Xcube-Studio/Natsurainko.FluentLauncher/blob/main/LICENSE"
              Glyph="fluent:slide-text-20-regular"
              Token="MIT"
            />
            <TokenItem Glyph="fluent:code-cs-16-regular" />
            <TokenItem
              Glyph="fluent:app-generic-20-filled"
              Token="Windows 11"
            />
            <TokenItem Glyph="fluent:code-20-regular" Token="Open Source" />
            <TokenItem
              Glyph="fluent:design-ideas-20-filled"
              Token="Fluent Design"
            />
          </div>

          <div
            class="items-center hidden md:flex text-md text-neutral-700 dark:text-neutral-400 max-w-3xl mt-8"
          >
            目前主要由
            <AtSomeOne
              Name="natsurainko"
              href="https://github.com/natsurainko"
            />
            和
            <AtSomeOne Name="gaviny82" href="https://github.com/gaviny82" />
            进行维护
          </div>
        </div>

        <div
          style="
            margin-bottom: -32px;
            margin-right: -32px;
            background-position: left top;
          "
          class="hidden md:flex md:h-128 md:bg-no-repeat md:bg-cover grow ml-16 md:bg-[url('/imgs/launcher-about.png')] dark:md:bg-[url('/imgs/launcher-about-dark.png')]"
        ></div>

        <div class="grow max-w-32"></div>
      </div>

      <div
        class="overflow-hidden flex flex-col sm:flex-row rounded-lg border-1 hover:shadow-lg border-neutral-300 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-800 gap-2 p-8 hover:border-blue-800 transition dark:hover:border-blue-200"
      >
        <div class="grow max-w-32"></div>

        <div
          style="margin-bottom: -32px; margin-left: -32px"
          class="hidden md:flex md:h-128 md:bg-no-repeat md:bg-cover grow ml-16 md:bg-[url('/imgs/code-light.png')] dark:md:bg-[url('/imgs/code-dark.png')] bg-top"
        ></div>

        <div class="flex flex-col gap-2 sm:gap-4 md:pl-8 justify-center">
          <a
            href="https://github.com/Xcube-Studio/Natsurainko.FluentCore"
            class="font-semibold text-xl sm:text-2xl hover:underline text-blue-900 dark:text-blue-300 select-none"
          >
            <p>Fluent Core 启动核心</p>
          </a>

          <p
            class="flex flex-auto md:flex-none text-md sm:text-lg text-neutral-700 dark:text-neutral-400 max-w-3xl"
          >
            基于 .NET 8 的跨平台的模块化 Minecraft 启动核心<br />
            提供简单的模块化调用，简化开发流程
          </p>

          <div class="flex flex-wrap justify-left gap-2 max-w-100 mt-4">
            <TokenItem
              href="https://github.com/Xcube-Studio/Natsurainko.FluentCore"
              Glyph="mdi:github"
              Token="GitHub"
            />
            <TokenItem
              href="https://github.com/Xcube-Studio/Natsurainko.FluentCore/stargazers"
              Glyph="fluent:star-20-filled"
              Token="30+"
            />
            <TokenItem
              href="https://github.com/Xcube-Studio/Natsurainko.FluentCore/blob/main/LICENSE"
              Glyph="fluent:slide-text-20-regular"
              Token="MIT"
            />
            <TokenItem Glyph="fluent:code-cs-16-regular" />
            <TokenItem Glyph="fluent:app-generic-20-filled" Token=".NET 8" />
            <TokenItem
              Glyph="fluent:window-console-20-filled"
              Token="AOT Compatible"
            />
            <TokenItem Glyph="fluent:code-20-regular" Token="Open Source" />
          </div>

          <div
            class="items-center hidden md:flex text-md text-neutral-700 dark:text-neutral-400 max-w-3xl mt-8"
          >
            目前主要由
            <AtSomeOne
              Name="natsurainko"
              href="https://github.com/natsurainko"
            />
            和
            <AtSomeOne Name="gaviny82" href="https://github.com/gaviny82" />
            进行维护
          </div>
        </div>

        <div class="grow max-w-32"></div>
      </div>
    </div>

    <div class="flex flex-col p-8 sm:p-16 gap-4 items-center">
      <div
        style="width: 85vw"
        class="items-center flex flex-col rounded-lg border-1 hover:shadow-lg border-neutral-300 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-800 gap-4 p-8 hover:border-blue-800 transition dark:hover:border-blue-200"
      >
        <div class="flex">
          <a
            class="bg-neutral-200/40 select-none text-blue-900 dark:text-blue-300 dark:bg-neutral-700/40 px-4 py-0.5 rounded-2xl font-semibold"
          >
            <p>欢迎</p>
          </a>
        </div>

        <p class="font-bold text-3xl sm:text-5xl sm:leading-16 text-center">
          有好的开源创意？<br />加入我们，<br class="sm:hidden" />一起实现！
        </p>

        <p
          class="flex text-lg text-center text-neutral-700 dark:text-neutral-400 max-w-3xl"
        >
          我们正积极寻找着与我们志同道合的开发者加入我们 !
        </p>

        <fluent-button
          @click="
            () =>
              (currentWindow.location.href = 'https://qm.qq.com/q/8AKSiUUrn2')
          "
          appearance="primary"
          class="select-none rounded-md px-4 py-1.5 shadow"
        >
          <div class="flex gap-2 items-center">
            <Icon icon="fluent:chat-add-20-filled" class="w-6 h-6" />
            <p class="text-lg">加入我们</p>
          </div>
        </fluent-button>
      </div>
    </div>

    <div
      class="h-screen bg-[url('/imgs/day.png')] dark:bg-[url('/imgs/night.png')] bg-cover bg-bottom bg-gradient-t from-current to-inherit"
    ></div>
  </div>
</template>
