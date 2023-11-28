import {defineStore} from 'pinia'
import {useCookies} from "vue3-cookies";
import router from "@/router";
import {useApplicationErrorsStore} from './ApplicationErrorsStore';
import type {Account} from "@/types/Account";
import {AuthenticationService} from "@/services/AuthenticationService";
import {AccountService} from "@/services/AccountService";
import {useSocketStore} from "@/stores/SocketStore";

// constants
const $cookies = useCookies()
const authenticationService = new AuthenticationService()
const accountService = new AccountService()


export const useAuthenticationStore = defineStore('account', {
  state: () => ({
    account: null as Account | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => {
      return state.account !== null
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
      const response = await authenticationService.login(username, password)

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
      const socketStore = useSocketStore()
      $cookies.cookies.remove('token');
      this.account = null
      if (socketStore.isConnected())
      {
        socketStore.disconnect();
      }
      await router.push('/login');
    },


    async register(username: string, email: string, password: string, passwordConfirmation: string) {
      this.loading = true
      const response = await authenticationService.register(username, email, password, passwordConfirmation)

      if (response.status === 200) {
        $cookies.cookies.set('token', response.data.token, '1Y');
        this.loading = false
        await router.push('/dashboard');
      } else {
        this.handleBadRequest(response)
        this.loading = false
      }
    },


    async accountInfo() {
      const token = $cookies.cookies.get('token')
      if (token === undefined || token === null) {
        return
      }
      this.loading = true

      const response = await accountService.getAccountInfo(token)

      if (response.status === 200) {
        this.loading = false
        this.account = response.data
      } else {
        this.loading = false
      }
    },
  },
})


