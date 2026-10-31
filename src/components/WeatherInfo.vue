<script setup>
import CurrentWeather from "./CurrentWeather.vue"
import SunriseSunset from "./SunriseSunset.vue"
import HourlyForecast from "./HourlyForecast.vue"
import ThreeDayForecast from "./ThreeDayForecast.vue"
import { useI18n } from "../utils/i18n"
import { getCondition } from "../services/weather"
import { formatTemperature } from "../utils/format"

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
        <div class="unit-switch" role="group" :aria-label="t('units')">
          <button type="button" :class="{ active: unit === 'C' }" @click="emit('change-unit', 'C')">°C</button>
          <button type="button" :class="{ active: unit === 'F' }" @click="emit('change-unit', 'F')">°F</button>
        </div>
        <button type="button" class="icon-button" :aria-label="`${t('refresh')} ${place.location.name}`" @click="emit('refresh', place)">↻</button>
        <button type="button" class="icon-button danger" :aria-label="`${t('remove')} ${place.location.name}`" @click="emit('remove-place', place.location.id)">×</button>
      </div>
    </div>
    <CurrentWeather :place="place" :unit="unit" />
    <div class="weather-details">
      <div class="metrics">
        <div><span>{{ t("feelsLike") }}</span><strong>{{ Math.round(unit === "F" ? place.current.feelsLike * 9 / 5 + 32 : place.current.feelsLike) }}°</strong></div>
        <div><span>{{ t("humidity") }}</span><strong>{{ place.current.humidity }}%</strong></div>
        <div><span>{{ t("wind") }}</span><strong>{{ Math.round(unit === "F" ? place.current.windSpeed * .621371 : place.current.windSpeed) }} {{ unit === "F" ? "mi/h" : "km/h" }}</strong></div>
        <div><span>{{ t("precipitation") }}</span><strong>{{ place.current.precipitation }} mm</strong></div>
      </div>
      <SunriseSunset :day="place.daily[0]" />
      <HourlyForecast :hours="place.hourly" :unit="unit" />
      <ThreeDayForecast :days="place.daily" :unit="unit" />
      <p class="data-source">{{ t("provider") }} <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></p>
    </div>
    </template>
  </article>
</template>
