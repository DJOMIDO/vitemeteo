<script setup>
import { getCondition } from "../services/weather"
import { formatDate, formatTemperature } from "../utils/format"
import { useI18n } from "../utils/i18n"
defineProps({ place: Object, unit: String })
const emit = defineEmits(["change-unit"])
const { locale, t } = useI18n()
</script>

<template>
  <section class="current-weather" aria-labelledby="city-title">
    <div>
      <p class="eyebrow">
        <span>{{ formatDate(place.location.localTime, { weekday: "long", year: "numeric" }, locale) }}</span>
        <span class="updated-label">· {{ t("updated") }} {{ new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "zh" ? "zh-CN" : "fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(place.updatedAt)) }}</span>
      </p>
      <div class="city-heading">
        <h1 id="city-title">{{ place.location.name }}</h1>
        <div class="unit-switch mobile-unit-switch" role="group" :aria-label="t('units')">
          <button type="button" :class="{ active: unit === 'C' }" @click="emit('change-unit', 'C')">°C</button>
          <button type="button" :class="{ active: unit === 'F' }" @click="emit('change-unit', 'F')">°F</button>
        </div>
      </div>
      <p class="location-line">{{ [place.location.region, place.location.country].filter(Boolean).join(", ") }}</p>
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
