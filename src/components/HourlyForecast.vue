<script setup>
import { ref } from "vue"
import { getCondition } from "../services/weather"
import { formatHour, formatTemperature } from "../utils/format"
import { useI18n } from "../utils/i18n"
defineProps({ hours: Array, unit: String })
const { t, locale } = useI18n()
const selectedHour = ref(null)
const list = ref(null)

const scrollHours = (direction) => {
  list.value?.scrollBy({ left: direction * 260, behavior: "smooth" })
}
</script>

<template>
  <section class="forecast-section" aria-labelledby="hourly-title">
    <div class="section-heading">
      <h2 id="hourly-title">{{ t("nextHours") }}</h2>
      <div class="hourly-controls">
        <span>24 h</span>
        <button type="button" :aria-label="t('previous')" @click="scrollHours(-1)">←</button>
        <button type="button" :aria-label="t('next')" @click="scrollHours(1)">→</button>
      </div>
    </div>
    <div ref="list" class="hourly-list">
      <button
        v-for="(hour, index) in hours"
        :key="hour.time"
        type="button"
        class="hour-item"
        :class="{ selected: selectedHour?.time === hour.time }"
        :aria-label="`${formatHour(hour.time, locale)}, ${formatTemperature(hour.temperature, unit)}, ${getCondition(hour.code, locale).label}`"
        @click="selectedHour = hour"
      >
        <span class="hour-label">{{ index === 0 ? t("current") : formatHour(hour.time, locale) }}</span>
        <span class="small-weather-icon" role="img" :aria-label="getCondition(hour.code, locale).label">{{ getCondition(hour.code, locale).icon }}</span>
        <strong>{{ formatTemperature(hour.temperature, unit) }}</strong>
        <small v-if="hour.precipitationProbability">{{ hour.precipitationProbability }}% {{ t("rain") }}</small>
      </button>
    </div>
    <p v-if="selectedHour" class="hour-detail" aria-live="polite">
      {{ formatHour(selectedHour.time, locale) }} · {{ getCondition(selectedHour.code, locale).label }} · {{ t("windDetail") }} {{ Math.round(selectedHour.windSpeed) }} km/h
    </p>
  </section>
</template>
