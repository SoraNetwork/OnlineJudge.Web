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
import QuestionsView from "@/views/questions-view/QuestionsView.vue";
import CommunityView from "@/views/community-views/CommunityView.vue";
import ContestsView from "@/views/contests-views/ContestsView.vue";
import ProblemView from "@/views/questions-view/ProblemView.vue";
import SubmitView from "@/views/questions-view/SubmitView.vue";
import StatusView from "@/views/questions-view/StatusView.vue";
import StatusDetailView from "@/views/questions-view/StatusDetailView.vue";
import ContestView from "@/views/contests-views/ContestView.vue";
import CreatePostView from "@/views/community-views/CreatePostView.vue";
import PostDetailView from "@/views/community-views/PostDetailView.vue";
import TeamsView from "@/views/community-views/TeamsView.vue";
import TeamDetailView from "@/views/community-views/TeamDetailView.vue";
import ProfileSettingsView from "@/views/user-views/ProfileSettingsView.vue";
import CreateProblemView from "@/views/questions-view/CreateProblemView.vue";
import CreateContestView from "@/views/contests-views/CreateContestView.vue";

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
      path:"/questions/create",
      name:"createquestion",
      component: CreateProblemView,
    },
    {
      path:"/community",
      name:"Community",
      component: CommunityView,
    },
    {
      path:'/community/create-post',
      name:"CreatePost",
      component: CreatePostView,
    },
    {
      path: "/community/post/:id",
      name: "post-detail",
      component: PostDetailView,
    },
    {
      path:"/contests",
      name:"contests",
      component: ContestsView,
    },
    {
      path:"/contests/create",
      name:"createcontest",
      component: CreateContestView,
    },
    {
      path:"/contests/:id",
      name:'contest',
      component: ContestView,
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
      path: '/questions/:id/:fromcontestid?',
      name: 'question',
      component: ProblemView,
    },
    {
      path: '/questions/status/:id',
      name: 'status',
      component: StatusView,
    },
    {
      path: '/questions/status/detail/:id',
      name: 'status-detail',
      component: StatusDetailView,
    },
    {
      path: '/questions/:id/submit',
      name: 'submit',
      component: SubmitView,
    },
    {
      path: "/teams",
      name: "teams",
      component: TeamsView,
    },
    {
      path: "/teams/:id",
      name: "team-detail",
      component: TeamDetailView,
    },
    {
      path: "/profile/settings",
      name: "profile-settings",
      component: ProfileSettingsView,
      meta: { requiresAuth: true }  // 需要登录才能访问
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
