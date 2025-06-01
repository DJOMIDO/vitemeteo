<script setup>
defineProps({
    days: Array
})
</script>

<template>
    <div class="max-w-screen-md w-full mx-auto px-6">
        <div class=" text-white text-center">
            <h2 class="mb-4 text-2xl font-semibold">Prévisions sur 3 jours</h2>
            <div class="grid sm:grid-cols-3 md:grid-cols-3 gap-4 mx-auto">
                <div v-for="(day, index) in days" :key="index"
                    class="flex flex-col items-center p-4 bg-weather-primary rounded-md">
                    <!-- Date -->
                    <p class="text-lg font-bold">
                        {{ new Date(day.date).toLocaleDateString("fr", {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                        }) }}
                    </p>
                    <!-- Icon -->
                    <img class="w-auto h-[50px] object-cover" :src="day.day.condition.icon" alt="icon" />
                    <!-- Temp -->
                    <p class="text-md">
                        {{ Math.round(day.day.maxtemp_c) }}&deg; / {{ Math.round(day.day.mintemp_c) }}&deg;
                    </p>
                    <!-- Description -->
                    <p class="text-sm">{{ day.day.condition.text }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
