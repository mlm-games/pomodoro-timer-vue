import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize settings
import { useSettingsStore } from './stores/settings'
const settingsStore = useSettingsStore()
settingsStore.loadSettings()

app.mount('#app')