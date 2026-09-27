<script setup>
import { getCondition } from "../services/weather"
import { formatDate, formatTemperature } from "../utils/format"
import { useI18n } from "../utils/i18n"
defineProps({ days: Array, unit: String })
const { t, locale } = useI18n()
</script>

<template>
  <section class="forecast-section" aria-labelledby="daily-title">
    <div class="section-heading"><h2 id="daily-title">{{ t("tenDays") }}</h2><span>{{ t("longTerm") }}</span></div>
    <div class="daily-grid">
      <div v-for="(day, index) in days" :key="day.date" class="day-item">
        <p>{{ index === 0 ? t("today") : formatDate(day.date, {}, locale) }}</p>
        <span class="day-icon" role="img" :aria-label="getCondition(day.code, locale).label">{{ getCondition(day.code, locale).icon }}</span>
        <strong>{{ formatTemperature(day.max, unit) }} <em>{{ formatTemperature(day.min, unit) }}</em></strong>
        <span>{{ getCondition(day.code, locale).label }}</span>
        <small v-if="day.precipitationProbability">💧 {{ day.precipitationProbability }}%</small>
      </div>
    </div>
  </section>
</template>
