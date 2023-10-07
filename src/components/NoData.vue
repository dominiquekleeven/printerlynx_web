<script setup lang="ts">

defineProps<{
  name: string;
  message: string;
  page: string;
}>()

</script>

<template>
  <section>
    <article>
      <span class="mdi mdi-close"></span>
    </article>
    <main>
      <h5>No {{ name }}s</h5>
      <p>{{ message }}</p>
    </main>
    <router-link role="button" :to="page">Add {{ name.toLowerCase() }}</router-link>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  text-align: center;
}

section main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

section h5 {
  margin: 0;
  padding: 0;
}

section article {
  border-radius: 50% !important;
  height: 65px !important;
  width: 65px !important;
  padding: 10px !important;
  font-size: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--form-element-background-color);
  color: var(--muted-color);
  margin: 0;
}

section p {
  margin: 0;
  padding: 0;
  max-width: 600px;
  color: var(--muted-color);
}

</style>

