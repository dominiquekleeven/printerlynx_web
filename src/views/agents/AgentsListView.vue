<script setup lang="ts">
import NoData from "@/components/NoData.vue";
import type {Agent} from "@/types/Agent";
import {AgentService} from "@/services/AgentService";
import {onMounted, ref} from "vue";
import {RouterLink} from "vue-router";
import ConfirmationDialogue from "@/components/ConfirmationDialogue.vue";
import {epoch_to_date} from "@/common/util";
import {useSocketStore} from "@/stores/SocketStore";

const agentService = new AgentService()
const socketStore = useSocketStore()

let searchInput = ref('')
let deletePromptOpen = ref(false)

let agents = ref(Array<Agent>())
let agentsFiltered = ref(Array<Agent>())
let selectedAgent = ref<Agent>()

let loading = ref(false)
let visible_tokens = ref(Array<Agent>())


onMounted(() => {
  getAgents()

  if (!socketStore.isConnected()) {
    socketStore.connect()
  }

})

async function getAgents() {
  loading.value = true
  const response = await agentService.getAgents()
  if (response.status === 200) {
    agents.value = response.data
    agentsFiltered.value = response.data
    loading.value = false
  } else {
    loading.value = false
    agents.value = []
    agentsFiltered.value = []
  }
}

async function promptDeleteAgent(agent: Agent) {
  selectedAgent.value = agent
  deletePromptOpen.value = true
}

async function cancelDeleteAgent() {
  selectedAgent.value = undefined
  deletePromptOpen.value = false
}

async function confirmDeleteAgent() {
  if (!selectedAgent.value) {
    deletePromptOpen.value = false
    return
  }

  loading.value = true
  const response = await agentService.deleteAgent(selectedAgent.value?.uuid)
  if (response.status === 200) {
    loading.value = false
    selectedAgent.value = undefined
    deletePromptOpen.value = false
    await getAgents()
  } else {
    selectedAgent.value = undefined
    loading.value = false
    deletePromptOpen.value = false
  }
}

// search on input change (debounce 100ms)
function search() {
  setTimeout(() => {
    if (searchInput.value.length > 0) {
      agentsFiltered.value = agentsFiltered.value.filter((agent: Agent) => {
        return agent.name.toLowerCase().includes(searchInput.value.toLowerCase())
      })
    } else {
      agentsFiltered.value = agents.value
    }
  }, 100)
}

function showToken(agent: Agent) {
  visible_tokens.value.push(agent)
}

function hideToken(agent: Agent) {
  visible_tokens.value = visible_tokens.value.filter((a: Agent) => {
    return a.uuid !== agent.uuid
  })
}

function isTokenVisible(agent: Agent) {
  return visible_tokens.value.some((a: Agent) => {
    return a.uuid === agent.uuid
  })
}

function copyToClipboard(event: any, agent: Agent) {
  navigator.clipboard.writeText(agent.token)
  const targetElement = event.target;
  targetElement.classList.add('bounce')


  setTimeout(() => {
    targetElement.classList.remove('bounce')
  }, 700)
}

</script>

<template>
  <div>
    <article>
      <header>
        <hgroup>
          <router-link to="/agents/add"><span class="mdi mdi-plus-box"><span>Add agent</span></span></router-link>
          <h2><span class="mdi mdi-connection"></span> Printer Agents</h2>
          <h3>Linked or connected Printer Agents</h3>
        </hgroup>
      </header>

      <NoData v-if="agents.length < 1" name="Printer Agents Found"
              message="Add and register a printer agent to connect your 3D printers and start printing."
              button="Add Agent" page="/agents/add"></NoData>


      <div v-if="!loading && agents.length > 0">
        <div class="start">
          <input autocomplete="off" v-model="searchInput" @keyup="search()" style="max-width: 400px" type="search"
                 id="search"
                 name="search"
                 placeholder="Search for agents..">
        </div>


        <figure>
          <table role="grid">
            <thead>
            <tr>
              <th scope="col">Identifier</th>
              <th scope="col">Connection token</th>
              <th scope="col">Status</th>
              <th scope="col">Created at</th>
              <th scope="col">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(agent, index) in agentsFiltered">
              <td style="min-width: 300px">
                <hgroup>
                  {{ agent.name }}
                  <br>
                  <small>{{ agent.description }}</small>
                </hgroup>
              </td>
              <td>
                <div class="sensitive">
                  <input style="margin-bottom: 0" :class="isTokenVisible(agent) ? '' : 'pw'" :value="agent.token"
                         readonly>

                  <a class="mdi mdi-content-copy" @click="copyToClipboard($event, agent)"></a>

                  <a v-if="isTokenVisible(agent)" class="mdi mdi-eye-off" @click="hideToken(agent)"></a>
                  <a v-if="!isTokenVisible(agent)" class="mdi mdi-eye" @click="showToken(agent)"></a>

                </div>
              </td>
              <td>

                <div v-if="index === 0" class="positive">Online</div>
                <div v-if="index !== 0" class="neutral">
                  <div class="neutral">Offline</div>
                  <hr>
                  <small>
                    <router-link to="/documentation#connection-guide"> Connection guide</router-link>
                  </small>
                </div>

              </td>
              <td>{{ epoch_to_date(agent.created_at) }}</td>

              <td>
                <div class="actions">
                  <button class="primary"><span class="mdi mdi-pencil"></span></button>
                  <RouterLink class="primary" role="button" :to="'/agents/details/'+ agent.uuid"><span
                      class="mdi mdi-open-in-new"> </span></RouterLink>
                  <button @click="promptDeleteAgent(agent)" class="secondary"><span class="mdi mdi-trash-can"></span>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </figure>
      </div>

    </article>
  </div>

  <confirmation-dialogue v-if="selectedAgent" @negative="cancelDeleteAgent()" @affirmative="confirmDeleteAgent()"
                         :open="deletePromptOpen"
                         title="Confirm Delete" negative_text="Cancel" affirmative_text="Confirm">
    Are you sure you want to delete the following agent?
    <br><br>
    <i>{{ selectedAgent.name }}</i>
    <br><br>
    <span class="warning mdi mdi-alert-rhombus"></span> This will disconnect all 3D printers that are linked through
    this agent. <b>This action cannot be undone.</b>

  </confirmation-dialogue>


</template>

<style scoped>
.sensitive {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
}

.sensitive input {
  width: fit-content;
}
</style>
