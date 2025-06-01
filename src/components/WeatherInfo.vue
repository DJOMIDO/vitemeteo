<script setup>
import CurrentWeather from './CurrentWeather.vue'
import SunriseSunset from './SunriseSunset.vue'
import HourlyForecast from './HourlyForecast.vue'
import ThreeDayForecast from './ThreeDayForecast.vue'
import RemoveButton from './RemoveButton.vue'

defineProps({ place: Object })
const emit = defineEmits(['remove-place'])
</script>

<template>
    <div class="container flex flex-col py-6 px-3 text-white items-center">
        <CurrentWeather :place="place" />
        <SunriseSunset :astro="place.forecast.forecastday[0].astro" />
        <HourlyForecast :hours="place.forecast.forecastday[0].hour" />
        <ThreeDayForecast :days="place.forecast.forecastday" />
        <RemoveButton :lastUpdated="place.current.last_updated" :locationName="place.location.name"
            @remove-place="emit('remove-place')" />
    </div>
</template>
