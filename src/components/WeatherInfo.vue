<script setup>
import CurrentWeather from "./CurrentWeather.vue"
import HourlyForecast from "./HourlyForecast.vue"
import ThreeDayForecast from "./ThreeDayForecast.vue"
import { useI18n } from "../utils/i18n"
import { getCondition } from "../services/weather"
import { formatTemperature, formatTime } from "../utils/format"

defineProps({ place: Object, unit: String, compact: Boolean })
const emit = defineEmits(["remove-place", "refresh", "select-place", "change-unit"])
const { t, locale } = useI18n()
</script>

<template>
  <article class="weather-card" :class="{ 'is-compact': compact }">
    <button v-if="compact" class="compact-summary" type="button" @click="emit('select-place', place.location.id)">
      <span class="compact-icon" role="img" :aria-label="getCondition(place.current.code, locale).label">{{ getCondition(place.current.code, locale).icon }}</span>
      <span class="compact-place">
        <strong>{{ place.location.name }}</strong>
        <small>{{ getCondition(place.current.code, locale).label }}</small>
      </span>
      <strong class="compact-temperature">{{ formatTemperature(place.current.temperature, unit) }}</strong>
      <span class="compact-chevron" aria-hidden="true">→</span>
    </button>
    <template v-else>
    <div class="card-toolbar">
      <span class="live-label"><i aria-hidden="true"></i> {{ t("localForecast") }}</span>
      <div class="card-actions">
        <div class="unit-switch desktop-unit-switch" role="group" :aria-label="t('units')">
          <button type="button" :class="{ active: unit === 'C' }" @click="emit('change-unit', 'C')">°C</button>
          <button type="button" :class="{ active: unit === 'F' }" @click="emit('change-unit', 'F')">°F</button>
        </div>
        <button type="button" class="icon-button" :aria-label="`${t('refresh')} ${place.location.name}`" @click="emit('refresh', place)">↻</button>
        <button type="button" class="icon-button danger" :aria-label="`${t('remove')} ${place.location.name}`" @click="emit('remove-place', place.location.id)">×</button>
      </div>
    </div>
    <CurrentWeather :place="place" :unit="unit" @change-unit="emit('change-unit', $event)" />
    <div class="weather-details">
      <div class="metrics">
        <div><span><svg class="metric-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M9 18h6M10 21h4M8 15.5a6 6 0 1 1 8 0" /></svg>{{ t("feelsLike") }}</span><strong>{{ Math.round(unit === "F" ? place.current.feelsLike * 9 / 5 + 32 : place.current.feelsLike) }}°</strong></div>
        <div><span><svg class="metric-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5S6.5 10 6.5 14.5a5.5 5.5 0 0 0 11 0C17.5 10 12 3.5 12 3.5Z" /></svg>{{ t("humidity") }}</span><strong>{{ place.current.humidity }}%</strong></div>
        <div><span><svg class="metric-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8a3 3 0 1 0-3 3" /></svg>{{ t("wind") }}</span><strong>{{ Math.round(unit === "F" ? place.current.windSpeed * .621371 : place.current.windSpeed) }} {{ unit === "F" ? "mi/h" : "km/h" }}</strong></div>
        <div><span><svg class="metric-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 15.5h10a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.6 1A3 3 0 0 0 7 15.5Z" /><path d="M8 18.5v2M12 18.5v2M16 18.5v2" /></svg>{{ t("precipitation") }}</span><strong>{{ place.current.precipitation }} mm</strong></div>
        <div><span><svg class="metric-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V4M6 10l6-6 6 6M4 20h16" /></svg>{{ t("sunrise") }}</span><strong>{{ formatTime(place.daily[0].sunrise, locale) }}</strong></div>
        <div><span><svg class="metric-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M6 14l6 6 6-6M4 20h16" /></svg>{{ t("sunset") }}</span><strong>{{ formatTime(place.daily[0].sunset, locale) }}</strong></div>
      </div>
      <HourlyForecast :hours="place.hourly" :unit="unit" />
      <ThreeDayForecast :days="place.daily" :unit="unit" />
      <p class="data-source">{{ t("provider") }} <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></p>
    </div>
    </template>
  </article>
</template>
