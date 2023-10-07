<script setup lang="ts">
import FileList from '@/components/FileList.vue';
</script>

<template>
  <main class="container-fluid">

    <article>
      <header>
        <hgroup>
          <router-link role="headerbutton" to="/files/upload"><span class="mdi mdi-plus-box-multiple"></span>
          </router-link>
          <h3><span class="mdi mdi-folder"></span> Files Browser</h3>
          <h3>Centralized Print File Storage.</h3>
        </hgroup>
      </header>

      <FileList/>

    </article>
  </main>
</template>
