<script setup>
import { formatTime } from "../utils/format"
import { useI18n } from "../utils/i18n"
defineProps({ day: Object })
const { t, locale } = useI18n()
</script>

<template>
  <div class="sun-times">
    <div><span aria-hidden="true">↑</span><span>{{ t("sunrise") }} <strong>{{ formatTime(day.sunrise, locale) }}</strong></span></div>
    <div><span aria-hidden="true">↓</span><span>{{ t("sunset") }} <strong>{{ formatTime(day.sunset, locale) }}</strong></span></div>
  </div>
</template>
