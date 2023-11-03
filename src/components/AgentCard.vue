<script setup lang="ts">
import NoData from "@/components/NoData.vue";
</script>

<template>
  <div>
    <article>
      <header>
        <hgroup>
          <router-link to="/files"><span class="mdi mdi-plus-box-multiple"> Link Agent</span></router-link>
          <h2><span class="mdi mdi-connection"></span> Printer Agents</h2>
          <h3>Linked or connected Printer Agents</h3>
        </hgroup>
      </header>

      <NoData name="Printer Agent"
              message="Set up and link a new printer agent to establish a connection and show the list of currently connected 3D printers."
              button="Add Printer Agent" page="devices#new"></NoData>

    </article>
  </div>
</template>


