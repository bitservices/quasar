// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import en from './en.json'
import es from './es.json'
import fr from './fr.json'

const messages = {
  en,
  es,
  fr,
}

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
})

export default i18n
