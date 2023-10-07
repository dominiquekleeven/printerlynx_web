<script setup lang="ts">
import {ValidationError} from '@/types/ValidationError';

defineProps<{
  errors: ValidationError[];
}>()

</script>

<template>
  <div class="fadeIn" v-if="errors.length > 0">
    <article class="error">
      <ul>
        <li v-for="error in errors.slice(0, 5)">
          {{ error.message }}
        </li>
      </ul>
    </article>
  </div>
</template>

