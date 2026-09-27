<script setup>
import { computed, onMounted, provide, ref, watch } from "vue"
import Nav from "./components/Nav.vue"
import WeatherInfo from "./components/WeatherInfo.vue"
import { getWeather, getWeatherByCoordinates } from "./services/weather"
import { messages, supportedLocales } from "./utils/i18n"

const places = ref([])
const unit = ref(localStorage.getItem("vitemeteo-unit") || "C")
const loading = ref(false)
const error = ref("")
const notice = ref("")
const theme = ref(localStorage.getItem("vitemeteo-theme") || "dark")
const locale = ref(localStorage.getItem("vitemeteo-locale") || "fr")
const activePlaceId = ref(null)
const t = (key) => messages[locale.value][key] || messages.fr[key] || key
provide("locale", locale)
provide("t", t)

const hasPlaces = computed(() => places.value.length > 0)

const addPlace = async (place) => {
  if (places.value.some((item) => item.location.id === place.id)) {
    notice.value = `${place.name} ${locale.value === "zh" ? "已显示。" : locale.value === "en" ? "is already displayed." : "est déjà affichée."}`
    return
  }
  loading.value = true
  error.value = ""
  try {
    const weather = await (place.weather ? Promise.resolve(place.weather) : getWeather(place))
    places.value = [{ ...weather, location: { ...weather.location, ...place } }, ...places.value]
    activePlaceId.value = place.id
    localStorage.setItem("vitemeteo-places", JSON.stringify(places.value.map((item) => item.location)))
  } catch (requestError) {
    if (requestError.name !== "AbortError") error.value = requestError.message
  } finally {
    loading.value = false
  }
}

const removePlace = (id) => {
  places.value = places.value.filter((place) => place.location.id !== id)
  if (activePlaceId.value === id) activePlaceId.value = places.value[0]?.location.id || null
  localStorage.setItem("vitemeteo-places", JSON.stringify(places.value.map((item) => item.location)))
}

const refreshPlace = async (place) => {
  loading.value = true
  error.value = ""
  try {
    const weather = await getWeather(place.location)
    places.value = places.value.map((item) =>
      item.location.id === place.location.id ? weather : item,
    )
    activePlaceId.value = place.location.id
    localStorage.setItem("vitemeteo-places", JSON.stringify(places.value.map((item) => item.location)))
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    loading.value = false
  }
}

const locateUser = () => {
  if (!window.isSecureContext && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    error.value = t("secureLocation")
    return
  }
  if (!navigator.geolocation) {
    error.value = locale.value === "zh" ? "此浏览器不支持定位。" : locale.value === "en" ? "Geolocation is not available in this browser." : "La géolocalisation n’est pas disponible dans ce navigateur."
    return
  }
  loading.value = true
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    try {
      const weather = await getWeatherByCoordinates(coords.latitude, coords.longitude, undefined, locale.value)
      places.value = [weather, ...places.value.filter((item) => item.location.id !== weather.location.id)]
      activePlaceId.value = weather.location.id
      localStorage.setItem("vitemeteo-places", JSON.stringify(places.value.map((item) => item.location)))
    } catch (requestError) {
      error.value = requestError.message
    } finally {
      loading.value = false
    }
  }, (locationError) => {
    error.value = locationError.code === 1
      ? t("locationDenied")
      : locationError.code === 2
        ? t("locationUnavailable")
        : t("locationTimeout")
    loading.value = false
  }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 })
}

const changeUnit = (nextUnit) => {
  unit.value = nextUnit
  localStorage.setItem("vitemeteo-unit", nextUnit)
}

onMounted(async () => {
  document.documentElement.classList.toggle("theme-light", theme.value === "light")
  document.documentElement.lang = locale.value
  const savedPlaces = JSON.parse(localStorage.getItem("vitemeteo-places") || "[]")
  if (savedPlaces.length) {
    loading.value = true
    try {
      places.value = await Promise.all(savedPlaces.slice(0, 4).map(async (place) => {
        return getWeather(place)
      }))
      activePlaceId.value = places.value[0]?.location.id || null
    } catch {
      error.value = t("restoredError")
    } finally {
      loading.value = false
    }
  }
})

watch(theme, (value) => {
  document.documentElement.classList.toggle("theme-light", value === "light")
  localStorage.setItem("vitemeteo-theme", value)
})
watch(locale, (value) => {
  document.documentElement.lang = value
  localStorage.setItem("vitemeteo-locale", value)
})

const toggleTheme = () => { theme.value = theme.value === "dark" ? "light" : "dark" }
const cycleLocale = () => {
  locale.value = supportedLocales[(supportedLocales.indexOf(locale.value) + 1) % supportedLocales.length]
}
</script>

<template>
  <div class="app-shell">
    <Nav :loading="loading" :theme="theme" :locale="locale" @place-data="addPlace" @locate="locateUser" @toggle-theme="toggleTheme" @cycle-locale="cycleLocale" />
    <main id="main-content" class="app-main">
      <div v-if="error" class="status-message error-message" role="alert">{{ error }}</div>
      <div v-if="notice" class="status-message" aria-live="polite">{{ notice }}</div>
      <section v-if="!hasPlaces && !loading" class="empty-state" aria-labelledby="empty-title">
        <span class="empty-icon" aria-hidden="true">☀️</span>
        <h1 id="empty-title">{{ t("emptyTitle") }}</h1>
        <p>{{ t("emptyText") }}</p>
        <button class="button button-primary" type="button" @click="locateUser">{{ t("useLocation") }}</button>
      </section>
      <div v-else class="weather-list">
        <WeatherInfo
          v-for="place in places"
          :key="place.location.id"
          :place="place"
          :unit="unit"
          :compact="places.length > 1 && activePlaceId !== place.location.id"
          @select-place="activePlaceId = $event"
          @remove-place="removePlace"
          @refresh="refreshPlace"
        />
      </div>
      <div v-if="loading" class="loading-state" aria-live="polite">{{ t("loading") }}</div>
    </main>
    <footer class="app-footer">
      <span>{{ t("provider") }} <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></span>
      <div class="unit-switch" role="group" :aria-label="t('units')">
        <button type="button" :class="{ active: unit === 'C' }" @click="changeUnit('C')">°C</button>
        <button type="button" :class="{ active: unit === 'F' }" @click="changeUnit('F')">°F</button>
      </div>
    </footer>
  </div>
</template>
