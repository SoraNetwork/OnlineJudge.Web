import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import NewsView from "@/views/NewsView.vue";
import NotFoundView from "@/views/error-views/NotFoundView.vue";
import PrivacyView from "@/views/PrivacyView.vue";
import UnderConstructionView from "@/views/error-views/UnderConstructionView.vue";
import ProfileView from "@/views/user-views/ProfileView.vue";
import LoginView from "@/views/user-views/LoginView.vue";
import { checkLoginState, userInfo, hasPermission, isAdmin, isTeamAdmin} from "@/stores/userStore";
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
import UserManagement from "@/views/workspace-views/UserManagement.vue";
import WorkspaceView from "@/views/workspace-views/WorkspaceView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 主要页面
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
      path: "/privacy",
      name: "privacy",
      component: PrivacyView,
    },

    // 问题相关页面
    {
      path: "/questions",
      name: "questions",
      component: QuestionsView,
    },
    {
      path: '/questions/:id/:fromcontestid?',
      name: 'question',
      component: ProblemView,
    },
    {
      path: '/questions/:id/submit/:fromcontestid?',
      name: 'submit',
      component: SubmitView,
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

    // 社区相关页面
    {
      path: "/community",
      name: "Community",
      component: CommunityView,
    },
    {
      path: '/community/create-post',
      name: "CreatePost",
      component: CreatePostView,
    },
    {
      path: "/community/post/:id",
      name: "post-detail",
      component: PostDetailView,
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

    // 竞赛相关页面
    {
      path: "/contests",
      name: "contests",
      component: ContestsView,
    },
    {
      path: "/contests/:id",
      name: 'contest',
      component: ContestView,
    },

    // 用户相关页面
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
      path: "/profile/:username?",
      name: "profile",
      component: ProfileView,
      props: true,
    },
    {
      path: "/profile/settings",
      name: "profile-settings",
      component: ProfileSettingsView,
      meta: { requiresAuth: true }  
    },

    // 工作区相关页面
    {
      path: "/workspace",
      name: "workspace",
      component: WorkspaceView,
      meta: { requiresAuth: true }
    },
    {
      path: "/workspace/questions/create",
      name: "createquestion",
      component: CreateProblemView,
    },
    {
      path: "/workspace/contests/create",
      name: "createcontest",
      component: CreateContestView,
    },
    {
      path: "/workspace/admin/users",
      name: "user-management",
      component: UserManagement,
      meta: { requiresAuth: true }
    },

    // 错误和其他页面
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

  // 如果页面需要管理员权限且用户不是管理员，重定向到首页
  if (to.meta.requiresAdmin && !isAdmin()) {
    next('/');
    return;
  }

  // 如果页面需要团队管理员权限且用户不具备，重定向到首页
  if (to.meta.requiresTeamAdmin && !isTeamAdmin()) {
    next('/');
    return;
  }
 
  // 其他情况正常放行
  next();
});

export default router;
