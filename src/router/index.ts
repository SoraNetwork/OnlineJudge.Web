import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import NewsView from "@/views/NewsView.vue";
import NotFoundView from "@/views/error-views/NotFoundView.vue";
import PrivacyView from "@/views/PrivacyView.vue";
import UnderConstructionView from "@/views/error-views/UnderConstructionView.vue";
import ProfileView from "@/views/user-views/ProfileView.vue";
import LoginView from "@/views/user-views/LoginView.vue";
import { checkLoginState } from "@/stores/userStore";
import RegisterView from "@/views/user-views/RegisterView.vue";
import QuestionsView from "@/views/QuestionsView.vue";
import GroupView from "@/views/GroupView.vue";
import ContestsView from "@/views/ContestsView.vue";

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
      path: "/questions",
      name: "questions",
      component: QuestionsView,
    },
    {
      path:"/group",
      name:"group",
      component: GroupView,
    },
    {
      path:"/contests",
      name:"contests",
      component: ContestsView,
    },
    {
      path: "/privacy",
      name: "privacy",
      component: PrivacyView,
    },
    {
      path: "/profile/:username?",
      name: "profile",
      component: ProfileView,
      props: true,
    },
    {
      path: "/not-found",
      name: "not-found",
      component: NotFoundView,
    },
    {
      path: "/under-construction",
      name: "under-construction",
      component: UnderConstructionView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/not-found",
    },
  ],
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = checkLoginState();

  // 如果页面需要访客身份（如登录页）且用户已登录，重定向到首页
  if (to.meta.requiresGuest && isLoggedIn) {
    next('/');
    return;
  }

  // 如果页面需要登录且用户未登录，重定向到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // 其他情况正常放行
  next();
});

export default router;
