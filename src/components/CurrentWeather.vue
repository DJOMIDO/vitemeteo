<script setup>
import { getCondition } from "../services/weather"
import { formatDate, formatTemperature } from "../utils/format"
import { useI18n } from "../utils/i18n"
defineProps({ place: Object, unit: String })
const { locale, t } = useI18n()
</script>

<template>
  <section class="current-weather" aria-labelledby="city-title">
    <div>
      <p class="eyebrow">
        <span>{{ formatDate(place.location.localTime, { weekday: "long", year: "numeric" }, locale) }}</span>
        <span class="updated-label">· {{ t("updated") }} {{ new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "zh" ? "zh-CN" : "fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(place.updatedAt)) }}</span>
      </p>
      <h1 id="city-title">{{ place.location.name }}</h1>
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
