<script setup>
import { reactive } from "vue" // Import the reactive function from Vue

const emit = defineEmits(["place-data"]) // Define the emit function

const searchTerm = reactive({ // Create a reactive object
    query: "", // This is the search query
    timeout: null, // This is the timeout for the search
    results: null, // This is the search results
})

// This function handles the search
const handleSearch = () => {

    clearTimeout(searchTerm.timeout) // Clear the timeout

    // Set a new timeout
    searchTerm.timeout = setTimeout(async () => {

        // Check if the search term is not empty
        if (searchTerm.query != "") {

            // Fetch the search results from the API and set the results in the reactive object searchTerm
            const response = await fetch(

            // This is the API endpoint for the search
                `https://api.weatherapi.com/v1/search.json?key=d68e43ce95c948a993094609242905&q=${searchTerm.query}`

            )

            // Parse the response to JSON
            const data = await response.json()

            // Set the results in the reactive object searchTerm
            searchTerm.results = data

        } else { // If the search term is empty, set the results to null

            searchTerm.results = null

        }

    }, 500) // Set the timeout to 500ms

}

// This function gets the weather data for a place
const getWeather = async (id) => {

    const response = await fetch( // Fetch the weather data for the place

        `https://api.weatherapi.com/v1/forecast.json?key=d68e43ce95c948a993094609242905&q=id:${id}&days=10&aqi=no&alerts=no&lang=fr`

    )

    const data = await response.json() // Parse the response to JSON

    emit("place-data", data) // Emit the weather data to the parent component

    searchTerm.query = "" // Clear the search query

    searchTerm.results = null // Clear the search results

}
</script>

<template>

    <!-- This is the header section -->
    <header class="sticky top-0 bg-weather-primary shadow-md">
        <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">
            <div class="flex items-center gap-3 flex-1">
                <i class="fa-solid fa-cloud-sun text-5xl"></i>
                <p class="text-3xl font-bold">ViteMétéo</p>
            </div>

            <!-- This is the search form -->
            <div>
                <form>
                    <div class="bg-white border border-weather-secondary rounded-md flex items-center">
                        <i class="fa fa-magnifying-glass p-3 text-weather-primary"></i>
                        <input type="text" placeholder="Rechercher ..."
                            class="rounded p-3 focus:ring-0 text-weather-secondary" v-model="searchTerm.query"
                            @input="handleSearch" />
                    </div>
                </form>
            </div>
        </nav>
    </header>

    <!-- This is the search results container -->
    <div class="bg-white my-5 rounded-md flex container gap-4 items-center">
        <div v-if="searchTerm.results !== null">
            <div v-for="place in searchTerm.results" :key="place.id">
                <button class="px-5 my-5 hover:text-indigo-600 w-full text-left" @click="getWeather(place.id)">
                    {{ place.name }}, {{ place.region }}, {{ place.country }}
                </button>
            </div>
        </div>
    </div>
</template>