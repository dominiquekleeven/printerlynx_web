import {createRouter, createWebHistory} from 'vue-router'
import DashboardView from "@/views/DashboardView.vue";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import FilesView from "@/views/files/FilesView.vue"
import FilesUploadView from "@/views/files/FilesUploadView.vue";
import FilesListView from "@/views/files/FilesListView.vue";
import AgentsView from "@/views/agents/AgentsView.vue";
import AgentsListView from "@/views/agents/AgentsListView.vue";
import FileDetailsView from "@/views/files/FileDetailsView.vue";
import AgentsAddView from "@/views/agents/AgentsAddView.vue";
import {useAuthenticationStore} from "@/stores/AuthenticationStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {requiresAuth: true}
    },
    {
      path: '/',
      name: 'root',
      component: DashboardView,
      meta: {requiresAuth: true}

    },
    {
      path: '/agents',
      name: 'agents',
      component: AgentsView,
      meta: {requiresAuth: true},
      children: [
        {
          path: '', // default child path
          component: AgentsListView,
        },
        {
          path: 'add',
          component: AgentsAddView,
        },
      ]
    },
    {
      path: '/files',
      name: 'files',
      component: FilesView,
      meta: {requiresAuth: true},
      children: [
        {
          path: '', // default child path
          component: FilesListView,
        },
        {
          path: 'upload',
          component: FilesUploadView,
        },
        {
          path: 'details/:id',
          component: FileDetailsView,
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {guest: true}
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {guest: true}
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const accountStore = useAuthenticationStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guest = to.matched.some(record => record.meta.guest)
  try {
    await accountStore.accountInfo()
  } catch (e) {
    // we don't care about the error here, just that the user is not authenticated
  }
  const isAuthenticated = accountStore.isAuthenticated
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (guest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
});

export default router
