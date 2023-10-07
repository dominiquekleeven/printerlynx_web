<script setup lang="ts">
import ErrorCard from "@/components/ErrorCard.vue";
import {useApplicationErrorsStore} from "@/stores/ApplicationErrorsStore";
import {useUserAuthenticationStore} from "@/stores/UserAuthenticationStore";
import {ref} from "vue";

const userStore = useUserAuthenticationStore()
const errorStore = useApplicationErrorsStore()
errorStore.clearErrors()


let username = ref('')
let password = ref('')

function login(e: { preventDefault: () => void; }): void {
  e.preventDefault()
  userStore.login(username.value, password.value)
}

function clear() {
  username.value = ''
  password.value = ''
}

</script>
<template>
  <main class="container small">
    <div>
      <article>
        <header>
          <h2 class="lead"><span class="mdi mdi-account"></span> Login</h2>
        </header>
        <form @submit="login">
          <ErrorCard :errors="errorStore.errors"/>
          <div class="form-group">
            <label for="username">Username</label>
            <input v-model="username" type="text" id="username" placeholder="Username"/>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input v-model="password" type="password" id="password" placeholder="Password"/>
          </div>
          <div class="form-group">
            <span>Don't have an account? <router-link @click="clear" to="/register">Click here to
                register</router-link></span>
            <hr>
            <button :aria-busy="userStore.loading" type="submit">Login</button>
          </div>
        </form>
      </article>
    </div>
  </main>
</template>
