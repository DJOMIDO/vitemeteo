<script setup>

defineProps({
    place: Object // This is the prop that will be passed to the component
})

</script>

<template>

    <!-- This is the template for the WeatherInfo component -->
    <div class="container flex flex-col py-6 px-3 text-white items-center">

        <!-- This is the header of the WeatherInfo component -->
        <h1 class="text-5xl mb-3">{{ place.location.name }}</h1>

        <!-- This is the flex container for the date and location -->
        <div class="flex flex-col sm:flex-row justify-center items-center gap-2 mb-6">
            <div class="flex items-center gap-2">
                <i class="fa fa-clock"></i>
                <h2>{{ new Date(place.location.localtime).toLocaleDateString
                    (
                        "fr",
                        {
                            weekday: "short",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                    )
                    }},
                    {{ new Date(place.location.localtime).toLocaleTimeString
                        (
                            "fr",
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        )
                    }}
                </h2>
            </div>
            <div class="flex items-center gap-2">
                <i class="fa fa-location-dot"></i>
                <p>{{ place.location.region }}, {{ place.location.country }}</p>
            </div>
        </div>

        <!-- This is the flex container for the temperature and weather icon -->
        <div class="flex flex-row sm:flex-col justify-center items-center gap-2 mb-6">
            <img :src="place.current.condition.icon" alt="icon" width="150" class="mx-aut0">
            <h1 class="text-8xl mb-2">{{ Math.round(place.current.temp_c) }}&deg;</h1>
        </div>

        <!-- This is the flex container for the max and min temperature -->
        <div class="mb-6 text-xl justify-center items-center">
            <p>
                Max : {{ Math.round(place.forecast.forecastday[0].day.maxtemp_c) }}&deg; Min : {{
                    Math.round(place.forecast.forecastday[0].day.mintemp_c) }}&deg;
            </p>
        </div>

        <!-- This is the flex container for the weather condition and feels like temperature -->
        <div class="mb-6 justify-center items-center">
            <p>{{ place.current.condition.text }},
                ressenti : {{ Math.round(place.current.feelslike_c) }}&deg;</p>
        </div>

        <!-- This is the flex container for the sunrise and sunset -->
        <div class="flex flex-col sm:flex-row justify-center items-center gap-2 mb-6">

            <div class="flex items-center gap-2">
                <i class="fa fa-sun"></i>
                <p>Lever du soleil : {{ place.forecast.forecastday[0].astro.sunrise }}</p>
            </div>

            <div class="flex items-center gap-2">
                <i class="fa fa-moon"></i>
                <p>Coucher du soleil : {{ place.forecast.forecastday[0].astro.sunset }}</p>
            </div>

        </div>

        <!-- This is the flex container for the hourly forecast -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white text-center">
                <h2 class="mb-4 text-xl">Prévisions horaires</h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div v-for="(hour, index) in place.forecast.forecastday[0].hour" :key="index"
                        class="flex flex-col gap-4 items-center">
                        <p class="whitespace-nowrap text-md">
                            {{ new Date(hour.time).toLocaleTimeString("fr", { hour: '2-digit' }) }}
                        </p>
                        <img class="w-auto h-[50px] object-cover" :src="hour.condition.icon" alt="icon" />
                        <p class="text-xl">
                            {{ Math.round(hour.temp_c) }}&deg;
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- This is the flex container for the 10-day forecast -->
        <div class="max-w-screen-md w-full mx-auto px-6">
            <div class="text-white text-center">
                <h2 class="mb-4 text-xl">Prévisions sur 10 jours</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <div v-for="(day, index) in place.forecast.forecastday" :key="index"
                        class="flex flex-col items-center p-4 bg-weather-primary rounded-md">
                        <p class="text-lg font-bold">
                            {{ new Date(day.date).toLocaleDateString("fr", {
                                weekday: 'short', day: 'numeric', month:
                                    'short'
                            }) }}
                        </p>
                        <img class="w-auto h-[50px] object-cover" :src="day.day.condition.icon" alt="icon" />
                        <p class="text-md">
                            {{ Math.round(day.day.maxtemp_c) }}&deg; / {{ Math.round(day.day.mintemp_c) }}&deg;
                        </p>
                        <p class="text-sm">{{ day.day.condition.text }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- This is the flex container for the last updated time -->
        <div class="mt-8 text-center mb-6 text-white">
            <h3 class="mb-4">Dernière mise à jour : {{ place.current.last_updated }} sur <a
                    href="https://www.weatherapi.com" target="_blank">weatherapi.com</a></h3>

            <!-- This is the button to remove the place from the list -->
            <button @click="$emit('remove-place', place.location.name)">
                <i class="fa fa-trash"></i>
            </button>
        </div>
    </div>

</template>

<style scoped>
.hourly-forecast {
    width: 100%;
}

.hourly-item {
    text-align: center;
}
</style>