<script setup lang="ts">

import {PrintFileService} from "@/services/PrintFileService";
import NoData from "@/components/NoData.vue";
import {onMounted, ref} from "vue";
import {PrintFile} from "@/types/PrintFile";

let loading = ref(true)
let searchInput = ref('')

// all files from api
let printFiles = ref(Array<PrintFile>())
// filtered files for search
let printFilesFiltered = ref(Array<PrintFile>())
const printFileService = new PrintFileService()

async function getFiles() {
  loading.value = true
  const response = await printFileService.getFiles()
  if (response.status === 200) {
    loading.value = false
    printFiles.value = response.data
    printFilesFiltered.value = response.data
  } else {
    loading.value = false
  }
}

function bytes_to_size(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'

  // limit to 2 decimal places
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

// search on input change (debounce 100ms)
function search() {
  setTimeout(() => {
    if (searchInput.value.length > 0) {
      printFilesFiltered.value = printFilesFiltered.value.filter((file: PrintFile) => {
        return file.name.toLowerCase().includes(searchInput.value.toLowerCase())
      })
    } else {
      printFilesFiltered.value = printFiles.value
    }
  }, 100)

}

onMounted(() => {
  getFiles()
})
</script>

<template>
  <NoData v-if="printFiles.length < 1 && !loading" name="File" page="/files/upload" button="Upload File"
          message="You haven't uploaded any print files yet"/>

  <figure v-if="!loading && printFiles.length > 0">
    <div class="start">
      <input v-model="searchInput" @keyup="search()" style="max-width: 400px" type="search" id="search" name="search" placeholder="Search for files..">
    </div>


    <table role="grid">
      <thead>
      <tr>
        <th scope="col">File Name</th>
        <th scope="col">Size</th>
        <th scope="col">Last Modified</th>
        <th scope="col">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(file, index) in printFilesFiltered">
        <td>
          <hgroup>
            {{ file.name }}
            <br>
            <small data-tooltip="SHA-256 checksum" data-placement="bottom">{{ file.checksum.slice(0, 35) }}...</small>
          </hgroup>
        </td>
        <td>{{ bytes_to_size(file.size) }}</td>
        <td>{{ new Date(file.created_at * 1000).toDateString() }}</td>
        <td>
          <div class="actions">
            <a role="button" href="#" class="primary"> <span class="mdi mdi-open-in-new"></span></a>
            <a role="button" href="#" class="secondary"> <span class="mdi mdi-trash-can"></span></a>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </figure>

</template>

<style scoped>

.actions {
  display: flex;
  gap: 0.5em;
}

a[role="button"] {
  padding: 5px !important;
  font-size: 1em;
  width: 100%;
}

</style>

