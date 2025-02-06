import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import NewsView from "@/views/NewsView.vue";
import NotFoundView from "@/views/error-views/NotFoundView.vue";
import FluentLauncherPrivacyView from "@/views/fluent-launcher/PrivacyView.vue";
import UnderConstructionView from "@/views/error-views/UnderConstructionView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/projects",
      name: "projects",
      component: ProjectsView,
    },
    {
      path: "/news",
      name: "news",
      component: NewsView,
    },
    {
      path: "/fluent-launcher/privacy",
      name: "Fluent-Launcher-Privacy",
      component: FluentLauncherPrivacyView,
    },
    {
      path: "/not-found",
      name: "Not-Found",
      component: NotFoundView,
    },
    {
      path: "/under-construction",
      name: "Under-Construction",
      component: UnderConstructionView,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/not-found",
    },
  ],
});

export default router;
