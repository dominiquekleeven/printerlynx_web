<script setup lang="ts">
import PrintFileUpload from "@/components/PrintFileUpload.vue";
import {RouterLink} from "vue-router";
</script>

<template>
  <main class="container-fluid">
    <nav aria-label="breadcrumb">
      <ul>
          <li><RouterLink to="/files">Files</RouterLink></li>
        <li>Upload</li>
      </ul>
    </nav>
    <PrintFileUpload/>
  </main>
</template>
