<script setup lang="ts">
import FileList from '@/components/FileList.vue';
</script>

<template>

  <article>
    <header>
      <hgroup>
        <router-link to="/files/upload"><span class="mdi mdi-file-plus"><span>Upload file</span></span>
        </router-link>
        <h2><span class="mdi mdi-folder"></span> Files Browser</h2>
        <h3>Centralized Print File Storage.</h3>
      </hgroup>
    </header>
    <FileList/>
  </article>
</template>


