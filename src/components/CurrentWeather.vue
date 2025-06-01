<script setup>
defineProps({
    place: Object
})
</script>

<template>
    <div class="mb-8 text-center">
        <!-- City name -->
        <h1 class="text-5xl mb-3">{{ place.location.name }}</h1>

        <!-- Local date and time -->
        <div class="flex flex-col sm:flex-row justify-center items-center gap-2 mb-6 text-lg">
            <div class="flex items-center gap-2">
                <i class="fa fa-clock"></i>
                <span>
                    {{ new Date(place.location.localtime).toLocaleDateString("fr", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                    day: "numeric"
                    }) }},
                    {{ new Date(place.location.localtime).toLocaleTimeString("fr", {
                        hour: "2-digit",
                        minute: "2-digit"
                    }) }}
                </span>
            </div>
            <div class="flex items-center gap-2">
                <i class="fa fa-location-dot"></i>
                <span>{{ place.location.region }}, {{ place.location.country }}</span>
            </div>
        </div>

        <!-- Weather icon and current temperature -->
        <div class="flex flex-row sm:flex-col justify-center items-center gap-2 mb-6">
            <img :src="place.current.condition.icon" alt="icon" width="150" class="mx-auto" />
            <h1 class="text-8xl mb-2">{{ Math.round(place.current.temp_c) }}&deg;</h1>
        </div>

        <!-- Weather description and feels like temperature -->
        <div>
            <p class="text-xl">
                {{ place.current.condition.text }}.
                Ressenti : {{ Math.round(place.current.feelslike_c) }}&deg;
            </p>
        </div>
    </div>
</template>
