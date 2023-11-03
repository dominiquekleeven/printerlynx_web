<script setup lang="ts">
import {useApplicationErrorsStore} from "@/stores/ApplicationErrorsStore";
import {useUserAuthenticationStore} from "@/stores/UserAuthenticationStore";
import ErrorCard from "@/components/ErrorCard.vue";
import {ref} from "vue";

const userStore = useUserAuthenticationStore()
const errorStore = useApplicationErrorsStore()
errorStore.clearErrors()

let username = ref('')
let email = ref('')
let password = ref('')
let passwordConfirmation = ref('')

function register(e: { preventDefault: () => void; }): void {
  e.preventDefault()
  errorStore.clearErrors()
  userStore.register(username.value, email.value, password.value, passwordConfirmation.value)
}

function clear() {
  username.value = ''
  email.value = ''
  password.value = ''
  passwordConfirmation.value = ''
}

</script>
<template>
  <main class="container small vh-center">
    <div>
      <article>
        <header>
          <h2 class="lead"><span class="mdi mdi-account"></span> Register</h2>
        </header>
        <form @submit="register">

          <ErrorCard :errors="errorStore.errors"/>

          <label for="username">Username</label>
          <input v-model="username" type="text" id="username" placeholder="username"/>

          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" placeholder="example@email.com"/>

          <label for="password">Password</label>
          <input v-model="password" type="password" id="password" placeholder="password"/>

          <label for="password">Confirm Password</label>
          <input v-model="passwordConfirmation" type="password" id="password" placeholder="password confirmation"/>

          <span>Already have a account? <router-link @click="clear" to="/login">Click here to login</router-link></span>
          <hr>
          <button :aria-busy="userStore.loading" type="submit" class="btn btn-primary">Register</button>

        </form>

      </article>
    </div>
  </main>
</template>