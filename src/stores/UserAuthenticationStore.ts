import {defineStore} from 'pinia'
import {useCookies} from "vue3-cookies";
import router from "@/router";
import {useApplicationErrorsStore} from './ApplicationErrorsStore';
import type {User} from "@/types/User";
import {UserAuthenticationService} from "@/services/UserAuthenticationService";

// constants
const $cookies = useCookies()
const userService = new UserAuthenticationService()

export const useUserAuthenticationStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => {
      return state.user !== null
    }
  },

  actions: {
    handleBadRequest(error: any) {
      if (error.response.status === 400) {
        if (Array.isArray(error.response.data)) {
          useApplicationErrorsStore().addErrors(error.response.data)
          return
        }
        if (typeof error.response.data === 'object') {
          useApplicationErrorsStore().addError(error.response.data)
          return
        }
      }
    },

    async login(username: string, password: string) {
      this.loading = true
      const response = await userService.login(username, password)

      if (response.status === 200) {
        $cookies.cookies.set('token', response.data.token, '1Y');
        this.loading = false
        await router.push('/dashboard');
      } else {
        this.loading = false
        this.handleBadRequest(response)
      }
    },


    async logout() {
      $cookies.cookies.remove('token');
      this.user = null
      await router.push('/login');
    },


    async register(username: string, email: string, password: string, passwordConfirmation: string) {
      this.loading = true
      const response = await userService.register(username, email, password, passwordConfirmation)

      if (response.status === 200) {
        $cookies.cookies.set('token', response.data.token, '1Y');
        this.loading = false
        await router.push('/dashboard');
      } else {
        this.handleBadRequest(response)
        this.loading = false
      }
    },


    async userInfo() {
      const token = $cookies.cookies.get('token')
      if (token === undefined || token === null) {
        return
      }
      this.loading = true

      const response = await userService.getUserInfo(token)

      if (response.status === 200) {
        this.loading = false
        this.user = response.data
      } else {
        this.loading = false
      }
    },
  },
})


