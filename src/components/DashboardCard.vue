<script setup lang="ts">
import NoData from "@/components/NoData.vue";
import {onMounted, ref} from "vue";
import {Agent} from "@/types/Agent";
import {AgentService} from "@/services/AgentService";




let agents = ref(Array<Agent>())
const agentService = new AgentService()
let loading = ref(false)

let printers = ref(Array<any>())



onMounted(() => {
  getAgents()
})

async function getAgents() {
  loading.value = true
  const response = await agentService.getAgents()
  if (response.status === 200) {
    agents.value = response.data
    loading.value = false
  } else {
    loading.value = false
    agents.value = []
  }
}



</script>

<template>
  <div>
    <article>
      <header>
        <hgroup>
          <h2><span class="mdi mdi-view-dashboard"></span> Dashboard</h2>
          <h3>Summary of all 3D printers currently linked or connected.</h3>
        </hgroup>
      </header>

      <NoData v-if="agents.length < 1 && !loading" name="Printer Agents"
              message="Add and register a printer agent to establish a connection and show the list of currently connected 3D printers."
              button="Add Agent" page="/agents/add"></NoData>

      <div v-if="agents.length > 0">

        <NoData button="Connection Guide" name="3D Printers Found" page="/" message="Please read the connection guide on how to connect your 3D printers." v-if="printers.length < 1"></NoData>

      </div>

    </article>
  </div>
</template>


