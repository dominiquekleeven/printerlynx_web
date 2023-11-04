<script setup lang="ts">
import {RouterLink, useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {PrintFile} from "@/types/PrintFile";
import {PrintFileService} from "@/services/PrintFileService";
import {bytes_to_size, epoch_to_date} from "@/common/util";
import * as GCodePreview from "gcode-preview";

const route = useRoute()
let file = ref<PrintFile>()
let file_data = ref()
let loading = ref(false)
let loading_data = ref(false)
let id = ref<string>(route.params.id as string)
let gcodePreview = ref<HTMLCanvasElement>()
let previewing = ref(true)

// on mounted
onMounted(async () => {
  await getFile();
  await getFileData();
})

const printFileService = new PrintFileService()


async function getFileData() {
  if (!id.value) {
    return
  }
  loading_data.value = true

  const response = await printFileService.getFileDownload(id.value)
  if (response.status === 200) {
    loading_data.value = false
    console.log(response.data)
    file_data.value = response.data
    preview_file(response.data)
  } else {
    file_data.value = undefined
    loading_data.value = false
  }
}


function preview_file(data: string) {
  loading_data.value = true
  let preview = GCodePreview.init({
    canvas: gcodePreview.value,
    // @ts-ignore
    buildVolume: {
      x: 180,
      y: 180,
      z: 180,
    },
    initialCameraPosition: [400, 250, 0],
    extrusionColor: '#01aaff',
    backgroundColor: '#1a1f28',
    topLayerColor: '#ff0000',
    debug: true,
  });


  preview.processGCode(data)
  loading_data.value = false
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

      <hr>


      <h4 v-if="loading_data">Loading preview..</h4>
      <h4 v-if="!loading_data">Preview</h4>
      <div class="gcode-preview" v-show="previewing">
        <canvas :class="!loading_data ? 'visible' : 'invisible'" ref="gcodePreview"></canvas>
      </div>

    </ul>

  </article>

</template>


<style scoped>


.gcode-preview {
  width: 800px;
  height: 100%;
  border-radius: 5px;
  border: 2px solid var(--pico-muted-border-color);
  animation: fadeInRepeat 3s infinite;
  background-color: var(--pico-card-sectioning-background-color);
}

canvas {
  width: 800px;
  height: 100%;
  border-radius: 5px;
  transition: 1s;
}

.invisible {
  opacity: 0 !important;
}

.visible {
  opacity: 1 !important;
}


</style>


