import './assets/main.css'
import '@picocss/pico'
import '@mdi/font/css/materialdesignicons.css'
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia'
import VueCookies from 'vue3-cookies'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.use(VueCookies, {expireTimes: '1Y'})
app.mount('#app')
