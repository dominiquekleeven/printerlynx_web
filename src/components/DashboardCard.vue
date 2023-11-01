<script setup lang="ts">
import NoData from "@/components/NoData.vue";
</script>

<template>
  <div>
    <article>
      <header>
        <hgroup>
          <h3><span class="mdi mdi-view-dashboard"></span> Dashboard</h3>
          <h3>Summary of all 3D printers currently linked or connected.</h3>
        </hgroup>
      </header>

        <NoData name="Printer Agent" message="Set up and link a new printer agent to establish a connection and show the list of currently connected 3D printers." button="Add Printer Agent" page="devices#new"></NoData>

    </article>
  </div>
</template>


