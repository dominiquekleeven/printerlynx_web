<script setup lang="ts">
import {ref} from 'vue';
import * as GCodePreview from 'gcode-preview';
// @ts-ignore
import * as THREE from 'three';
import {PrintFileService} from "@/services/PrintFileService";
import ErrorCard from "@/components/ErrorCard.vue";
import {useApplicationErrorsStore} from "@/stores/ApplicationErrorsStore";
import router from "@/router";

const errorStore = useApplicationErrorsStore()
errorStore.clearErrors()

const gcodeService = new PrintFileService()

//refs
let selectedFile = ref()
let gcodePreview = ref<HTMLCanvasElement>()
let previewing = ref(false)
let loading = ref(false)
let fileInput = ref<HTMLInputElement>()


async function onSubmit(e: { preventDefault: () => void; }) {
  e.preventDefault()
  errorStore.clearErrors()
  loading.value = true
  let response = await gcodeService.uploadFile(selectedFile.value)

  if (response.status === 200) {
    loading.value = false
    await router.push('/files')
  } else {
    errorStore.addError({
      message: "Something went wrong while uploading the file, please try again.",
      code: 500
    })
  }

  loading.value = false
  previewing.value = false
  fileInput.value.value = ''
}

function readFileAsText(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error("Error reading the file."));
    };
    reader.readAsText(file);
  });
}

async function onFileChanged(this: any) {
  const fileInput = document.getElementById('file') as HTMLInputElement;
  if (fileInput.files.length === 0) {
    return;
  }
  previewing.value = true

  const topLayerColor = new THREE.Color(`hsl(180, 50%, 50%)`).getHex();
  const file = fileInput.files[0];
  selectedFile.value = file

  const text = await readFileAsText(file);
  const textString = text as string;

  let preview = GCodePreview.init({
    canvas: gcodePreview.value,
    // @ts-ignore
    buildVolume: {
      x: 200,
      y: 200,
      z: 200,
    },
    initialCameraPosition: [0, 100, 300],
    topLayerColor,
  });

  preview.processGCode(textString)
}

</script>

<template>
  <div>

    <article>
      <details open>
        <summary><span class="mdi mdi-upload"> File Upload </span></summary>
        <form @submit="onSubmit">



          <ErrorCard :errors="errorStore.errors"/>

          <div class="form-group">
            <input accept=".gcode" ref="fileInput" @change="onFileChanged" type="file" id="file" placeholder="File"/>
          </div>

          <div v-show="previewing">
            <canvas ref="gcodePreview"></canvas>
          </div>

          <button :disabled="!previewing" :aria-busy="loading" role="button" class="outline" type="submit"> Upload
            File
          </button>
        </form>

      </details>
    </article>

  </div>
</template>

<style scoped>
canvas {
  border-radius: 5px;
  animation: fadeIn 1s forwards;
  width: 100%;
  margin-bottom: 25px;
}

article {
  margin-top: 15px;
}
</style>

