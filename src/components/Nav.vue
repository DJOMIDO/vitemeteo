<script setup>
import { ref, watch } from "vue"
import { searchCities } from "../services/weather"
import { useI18n } from "../utils/i18n"

const props = defineProps({ loading: Boolean, theme: String, locale: String })
const emit = defineEmits(["place-data", "locate", "toggle-theme", "cycle-locale"])
const { t } = useI18n()
const query = ref("")
const results = ref([])
const searching = ref(false)
const searchError = ref("")
let controller
let timeout

watch([query, () => props.locale], ([value]) => {
  clearTimeout(timeout)
  results.value = []
  searchError.value = ""
  if (value.trim().length < 2) return
  timeout = setTimeout(async () => {
    controller?.abort()
    controller = new AbortController()
    searching.value = true
    try {
      results.value = await searchCities(value.trim(), controller.signal, props.locale)
    } catch (error) {
      if (error.name !== "AbortError") searchError.value = error.message
    } finally {
      searching.value = false
    }
  }, 350)
})

const selectPlace = (place) => {
  emit("place-data", place)
  query.value = ""
  results.value = []
}
</script>

<template>
  <header class="app-header">
    <nav class="header-inner" :aria-label="t('nav')">
      <a class="brand" href="/" aria-label="ViteMétéo, accueil">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="presentation">
            <circle cx="12" cy="12" r="4.25" />
            <path d="M12 2v2.25M12 19.75V22M2 12h2.25M19.75 12H22M4.93 4.93l1.59 1.59M17.48 17.48l1.59 1.59M19.07 4.93l-1.59 1.59M6.52 17.48l-1.59 1.59" />
          </svg>
        </span>
        <span>Vite<span>Météo</span></span>
      </a>
      <div class="search-area">
        <form class="search-form" role="search" @submit.prevent>
          <label class="sr-only" for="city-search">{{ t("search") }}</label>
          <span aria-hidden="true">⌕</span>
          <input id="city-search" v-model="query" name="city" type="search" autocomplete="off" :placeholder="t('search')" />
          <button class="location-button" type="button" :aria-label="t('locate')" @click="emit('locate')">◎</button>
        </form>
        <div v-if="query.length >= 2" class="search-results" role="listbox" :aria-label="t('results')">
          <p v-if="searching" class="search-status">{{ t("searching") }}</p>
          <p v-else-if="searchError" class="search-status">{{ searchError }}</p>
          <p v-else-if="!results.length" class="search-status">{{ t("noResults") }}</p>
          <button v-for="place in results" v-else :key="place.id" type="button" role="option" @click="selectPlace(place)">
            <strong>{{ place.name }}</strong><span>{{ [place.region, place.country].filter(Boolean).join(", ") }}</span>
          </button>
        </div>
      </div>
      <div class="header-actions">
        <button type="button" class="preference-button" :aria-label="theme === 'dark' ? t('themeLight') : t('themeDark')" @click="emit('toggle-theme')">{{ theme === "dark" ? "☀" : "☾" }}</button>
        <button type="button" class="language-button" :aria-label="t('language')" @click="emit('cycle-locale')">{{ locale.toUpperCase() }}</button>
      </div>
    </nav>
  </header>
</template>
