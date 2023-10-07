import {createRouter, createWebHistory} from 'vue-router'
import DashboardView from "@/views/DashboardView.vue";
import RegisterView from "@/views/RegisterView.vue";
import {useUserAuthenticationStore} from '@/stores/UserAuthenticationStore'
import LoginView from "@/views/LoginView.vue";
import FilesView from "@/views/FilesView.vue"
import FilesUploadView from "@/views/FilesUploadView.vue";
import FilesListView from "@/views/FilesListView.vue";

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
  const userStore = useUserAuthenticationStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guest = to.matched.some(record => record.meta.guest)
  try {
    await userStore.userInfo()
  } catch (e) {
    // we don't care about the error here, just that the user is not authenticated
  }
  const isAuthenticated = userStore.isAuthenticated
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (guest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
});

export default router
