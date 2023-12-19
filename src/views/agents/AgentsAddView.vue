<script setup lang="ts">
import {RouterLink} from "vue-router";
import ErrorCard from "@/components/ErrorCard.vue";
import {ref} from "vue";
import {AgentService} from "@/services/AgentService";
import {useApplicationErrorsStore} from "@/stores/ApplicationErrorsStore";
import router from "@/router";


const agentService = new AgentService()
const errorStore = useApplicationErrorsStore()
errorStore.clearErrors()

let name = ref('')
let description = ref('')
let loading = ref(false)

async function submit(e: { preventDefault: () => void; }) {
  e.preventDefault()
  errorStore.clearErrors()
  loading.value = true

  const response = await agentService.addAgent(name.value, description.value)
  if (response.status === 200) {
    loading.value = false
    await router.push('/agents')
  } else {
    if (response.response.data) {
      errorStore.addError(response.response.data)
    } else {
      errorStore.addError({message: 'An unknown error occurred, please try again later', status: 500})
    }

  }

  loading.value = false
}


</script>

<template>
  <main class="container nopad">
    <nav aria-label="breadcrumb">
      <ul>
        <li>
          <RouterLink to="/agents">Agents</RouterLink>
        </li>
        <li>Add</li>
      </ul>
    </nav>

    <article>
      <header>
        <h2 class="lead"><span class="mdi mdi-connection"></span> Add Agent</h2>
      </header>
      <ErrorCard :errors="errorStore.errors"/>
      <form autocomplete="off" @submit="submit">


        <label for="name">Identifier</label>
        <input v-model="name" type="text" id="name" placeholder="A name to identify your agent.."/>

        <label for="description">Description</label>
        <input v-model="description" type="text" id="description" placeholder="(Optional) Description for the agent.."/>

        <hr>
        <button :aria-busy="loading" type="submit">Add Agent</button>

      </form>
    </article>
  </main>
</template>
