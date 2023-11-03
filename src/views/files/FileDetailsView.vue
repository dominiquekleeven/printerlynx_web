<script setup lang="ts">
import {RouterLink, useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {PrintFile} from "@/types/PrintFile";
import {PrintFileService} from "@/services/PrintFileService";
import {bytes_to_size, epoch_to_date} from "@/common/util";

const route = useRoute()
let file = ref<PrintFile>()
let loading = ref(false)
let id = ref<string>(route.params.id as string)

// on mounted
onMounted(async () => {
  await getFile();
})

const printFileService = new PrintFileService()


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
        <h2><span class="mdi mdi-file"></span> File Details</h2>
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
        <span>Last Modified: </span><span v-if="file">{{ epoch_to_date(file.created_at) }}</span>
      </li>

    </ul>

  </article>

</template>


