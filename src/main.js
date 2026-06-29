import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { createI18n } from 'vue-i18n'
import id from './locales/id.json'
import en from './locales/en.json'

const app = createApp(App)

const i18n = createI18n({
  legacy: false,
  locale: 'id',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    id: id,
    en: en,
  },
})

app.use(createPinia())
app.use(i18n)
app.use(router)
app.mount('#app')
