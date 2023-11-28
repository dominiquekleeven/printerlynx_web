<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {ref} from "vue";
import {useAuthenticationStore} from "@/stores/AuthenticationStore";

const accountStore = useAuthenticationStore()


let collapsed = ref(false)

//auto collapse on tablet/mobile
if (window.innerWidth < 768) {
  collapsed.value = true
}

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}


</script>

<template>
  <div class="core">
    <aside :class="collapsed ? 'collapsed' : ''" class="layout-nav" v-if="accountStore.isAuthenticated">
      <nav>
        <ul>
          <li><span style="color: #5cdbff" class="mdi mdi-transit-connection-variant"></span>
            <span class="link-text"><b>Printerlynx</b></span>
          </li>
          <hr>
          <li>
            <RouterLink to="/dashboard">
              <span class="mdi mdi-view-dashboard"></span>
              <span class="link-text">Dashboard</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/agents">
              <span class="mdi mdi-connection"></span>
              <span class="link-text">Agents</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/devices">
              <span class="mdi mdi-printer-3d"></span>
              <span class="link-text">Printers</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/files">
              <span class="mdi mdi-folder-multiple"></span>
              <span class="link-text">Files</span>
            </RouterLink>
          </li>

          <hr>
          <li>
            <a href="https://google.com">
              <span class="mdi mdi-file-document-multiple"></span>
              <span class="link-text">Documentation</span>
            </a>
          </li>

          <hr>
          <li>
            <RouterLink to="/account">
              <span class="mdi mdi-account"></span>
              <span style="text-transform: capitalize" class="link-text">{{ accountStore.account?.username }}</span></RouterLink>
          </li>
          <li>
            <a href="#" @click="accountStore.logout()"> <span class="mdi mdi-logout-variant"></span>
              <span class="link-text">Logout</span>
            </a>
          </li>


          <li class="bottom">
            <a @click="toggleCollapsed()" href="#">
              <span :class="collapsed ? 'mdi-arrow-expand-right' : 'mdi-arrow-expand-left' " class="mdi "></span>
              <span class="link-text"></span>
            </a>
          </li>


        </ul>

      </nav>
    </aside>
    <RouterView/>
  </div>


</template>

@/stores/UserAuthenticationStore