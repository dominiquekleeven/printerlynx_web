<script setup lang="ts">
import {RouterLink, useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {PrintFile} from "@/types/PrintFile";
import {PrintFileService} from "@/services/PrintFileService";

const route = useRoute()
let file = ref<PrintFile>()
let loading = ref(false)
let id = ref<string>(route.params.id as string)

// on mounted
onMounted(async () => {
  await getFile();
})

const printFileService = new PrintFileService()

function bytes_to_size(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

async function getFile() {
  if (!id.value) {
    return
  }
  loading.value = true

  const response = await printFileService.getFile(id.value)
  if (response.status === 200) {
    loading.value = false
    console.log(response.data)
    file.value = response.data
  } else {
    file.value = undefined
    loading.value = false
  }
}
</script>

<template>
  <nav aria-label="breadcrumb">
    <ul>
      <li>
        <RouterLink to="/files/">Files</RouterLink>
      </li>
      <li :aria-busy="loading"><span v-if="file">{{ file.name }}</span></li>
    </ul>
  </nav>
  <article>
    <header>
      <hgroup>
        <h3><span class="mdi mdi-file"></span> File Details</h3>
        <h3 :aria-busy="loading"><span v-if="file">{{ file.name }}</span></h3>
      </hgroup>
    </header>

    <ul>
      <li>
        <span data-tooltip="File checksum, used to ensure file data integrity" data-placement="top">Checksum: </span>
        <span v-if="file">{{ file.checksum }}</span>
      </li>
      <li>
        <span>Size: </span><span v-if="file">{{ bytes_to_size(file.size) }}</span>
      </li>
      <li>
        <span>Last Modified: </span><span v-if="file">{{ new Date(file.created_at * 1000).toDateString() }}</span>
      </li>

    </ul>

  </article>

</template>


