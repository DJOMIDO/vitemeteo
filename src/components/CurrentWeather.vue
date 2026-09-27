<script setup>
import { getCondition } from "../services/weather"
import { formatDate, formatTemperature, formatTime } from "../utils/format"
import { useI18n } from "../utils/i18n"
defineProps({ place: Object, unit: String })
const { locale } = useI18n()
</script>

<template>
  <section class="current-weather" aria-labelledby="city-title">
    <div>
      <p class="eyebrow">{{ formatDate(place.location.localTime, { weekday: "long", year: "numeric" }, locale) }}</p>
      <h1 id="city-title">{{ place.location.name }}</h1>
      <p class="location-line">{{ [place.location.region, place.location.country].filter(Boolean).join(", ") }} · {{ formatTime(place.location.localTime, locale) }}</p>
    </div>
    <div class="current-reading">
      <span class="weather-icon" role="img" :aria-label="getCondition(place.current.code, locale).label">{{ getCondition(place.current.code, locale).icon }}</span>
      <div>
        <strong>{{ formatTemperature(place.current.temperature, unit) }}</strong>
        <p>{{ getCondition(place.current.code, locale).label }}</p>
      </div>
    </div>
  </section>
</template>
