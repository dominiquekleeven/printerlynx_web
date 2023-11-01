<script setup lang="ts">

defineProps<{
  title: string;
  affirmative_text: string;
  negative_text: string;
  open?: boolean;
}>()
</script>

<template>
  <dialog :open="open">
    <article>
      <header>
        <h3>{{ title }}</h3>
      </header>
      <p>
        <slot></slot>
      </p>
      <footer>
        <button @click="$emit('negative')" class="secondary">{{ negative_text }}</button>
        <button @click="$emit('affirmative')" class="primary">{{ affirmative_text }}</button>
      </footer>
    </article>
  </dialog>
</template>


<style scoped>

footer {
  display: flex;
  gap: 0.5em;
  margin-top: 25px !important;
}

button {
  margin-bottom: 0 !important;
}

header {
  margin-bottom: 25px;
}

h3 {
  margin: 0;
  padding: 0;
}

</style>



