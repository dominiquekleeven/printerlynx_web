<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {useUserAuthenticationStore} from '@/stores/UserAuthenticationStore'

const userStore = useUserAuthenticationStore()
</script>

<template>
  <div class="core">
    <aside v-if="userStore.isAuthenticated">
      <nav>
        <ul>
          <li><span style="color: #5cdbff" class="mdi mdi-transit-connection-variant"></span><b> Printerlynx</b></li>
          <hr>
          <li>
            <RouterLink to="/dashboard"><span class="mdi mdi-view-dashboard"> Dashboard</span></RouterLink>
          </li>
          <li>
            <RouterLink to="/devices"><span class="mdi mdi-connection"> Agents</span></RouterLink>
          </li>
          <li>
            <RouterLink to="/devices"><span class="mdi mdi-printer-3d"> Printers</span></RouterLink>
          </li>
          <li>
            <RouterLink to="/files"><span class="mdi mdi-folder-multiple"> Files</span></RouterLink>
          </li>

          <hr>
          <li>
            <a href="https://google.com" ><span class="mdi mdi-file-document-multiple"> Documentation</span></a>
          </li>
          <li>
          <RouterLink to="/system"><span class="mdi mdi-server-network"> System</span></RouterLink>
          </li>

          <hr>
          <li>
             <RouterLink to="/account"><span class="mdi mdi-account-settings"> Account</span></RouterLink>
          </li>
          <li>
            <a href="#" @click="userStore.logout()"> <span class="mdi mdi-logout-variant"></span> Logout</a>
          </li>
        </ul>

      </nav>
    </aside>
    <RouterView/>
  </div>


</template>

@/stores/UserAuthenticationStore