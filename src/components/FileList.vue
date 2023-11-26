<script setup lang="ts">

import {PrintFileService} from "@/services/PrintFileService";
import NoData from "@/components/NoData.vue";
import {onMounted, ref} from "vue";
import {PrintFile} from "@/types/PrintFile";
import ConfirmationDialogue from "@/components/ConfirmationDialogue.vue";
import {RouterLink} from "vue-router";
import {bytes_to_size, epoch_to_date} from "@/common/util";

let loading = ref(true)
let searchInput = ref('')
let deletePromptOpen = ref(false)
let selectedFile = ref<PrintFile>()


// all files from api
let printFiles = ref(Array<PrintFile>())
// filtered files for search
let printFilesFiltered = ref(Array<PrintFile>())
const printFileService = new PrintFileService()


onMounted(() => {
  getFiles()
})

async function getFiles() {
  loading.value = true
  const response = await printFileService.getFiles()
  if (response.status === 200) {
    loading.value = false
    printFiles.value = response.data
    printFilesFiltered.value = response.data
  } else {
    printFiles.value = []
    printFilesFiltered.value = []
    loading.value = false
  }
}

async function promptDeleteFile(file: PrintFile) {
  selectedFile.value = file
  deletePromptOpen.value = true
}

async function cancelDeleteFile() {
  selectedFile.value = undefined
  deletePromptOpen.value = false
}

async function confirmDeleteFile() {
  if (!selectedFile.value) {
    deletePromptOpen.value = false
    return
  }

  loading.value = true
  const response = await printFileService.deleteFile(selectedFile.value?.uuid)
  if (response.status === 200) {
    loading.value = false
    selectedFile.value = undefined
    deletePromptOpen.value = false
    await getFiles()
  } else {
    selectedFile.value = undefined
    loading.value = false
    deletePromptOpen.value = false
  }
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


</script>

<template>

  <NoData v-if="printFiles.length < 1 && !loading" name="Files" page="/files/upload" button="Upload File"
          message="You haven't uploaded any print files yet."/>

  <div v-if="!loading && printFiles.length > 0">
    <div class="start">
      <input v-model="searchInput" @keyup="search()" style="max-width: 400px" type="search" id="search" name="search"
             placeholder="Search for files..">
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
        <td>{{ epoch_to_date(file.created_at) }}</td>
        <td>
          <div class="actions">
            <RouterLink class="primary" role="button" :to="'/files/details/'+ file.uuid"><span
                class="mdi mdi-open-in-new"> </span></RouterLink>
            <button @click="promptDeleteFile(file)" class="secondary"><span class="mdi mdi-trash-can"></span></button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>


  <confirmation-dialogue v-if="selectedFile" @negative="cancelDeleteFile()" @affirmative="confirmDeleteFile()"
                         :open="deletePromptOpen"
                         title="Confirm Delete" negative_text="Cancel" affirmative_text="Confirm">
    Are you sure you want to delete the following file?
    <br><br>
    <i>{{ selectedFile.name }}</i>
    <br><br>
    <b>This action cannot be undone.</b>
  </confirmation-dialogue>


</template>


