<script setup lang="ts">


import {PrintFileService} from "@/services/PrintFileService";
import NoData from "@/components/NoData.vue";
import {onMounted, ref} from "vue";
import {PrintFile} from "@/types/PrintFile";


let loading = ref(true)
let printFiles = ref(Array<PrintFile>())
const printFileService = new PrintFileService()

async function getFiles() {
  loading.value = true
  const response = await printFileService.getFiles()

  if (response.status === 200) {
    loading.value = false
    printFiles.value = response.data
  } else {
    loading.value = false
  }
}

onMounted(() => {
  getFiles()
})


</script>

<template>
  <div>
    <NoData v-if="printFiles.length < 1 && !loading" name="File" page="/files/upload" button="Upload File" message="You haven't uploaded any print files yet"/>

    <figure v-if="printFiles.length > 0 && !loading">
      <table role="grid">
        <thead>
        <tr>
          <th scope="col">File Name</th>
          <th scope="col">Last Modified</th>
          <th scope="col">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(file, index) in printFiles">
          <td>
            <hgroup>
              {{ file.name }}
              <br>
              <small data-tooltip="SHA-256 checksum"
                     data-placement="bottom">{{ file.checksum.slice(0, 35) }}...</small>
            </hgroup>
          </td>
          <td style="min-width: 100px">{{ new Date(file.created_at * 1000).toDateString() }}</td>
          <td style="min-width: 115px">
            <div class="actions">
              <a role="button" href="#" class="primary"> <span class="mdi mdi-open-in-new"></span></a>
              <a role="button" href="#" class="secondary"> <span class="mdi mdi-trash-can"></span></a>
            </div>
          </td>
        </tr>


        </tbody>
      </table>
    </figure>

  </div>
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

