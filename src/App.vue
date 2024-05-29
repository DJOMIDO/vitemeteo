<script setup>
import { ref } from "vue"; // Import the ref function from Vue
import Nav from "./components/Nav.vue" // Import the Nav component
import WeatherInfo from "./components/WeatherInfo.vue"; // Import the WeatherInfo component

const places = ref([]) // Create a reactive reference for the places

// This function adds a place to the places array
const addPlace = (data) => {
  places.value.push(data) // Push the place data to the places array
}

// This function removes a place from the places array
const removePlace = (name) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet endroit ?")) { // Confirm the deletion
    places.value = places.value.filter((p) => p.location.name !== name) // Filter out the place to be removed
  }
}

</script>

<template>

<!-- This is the template for the App component -->
  <div class="flex flex-col min-h-screen font-Roboto bg-weather-secondary">
    <!-- This is the Nav component -->
    <Nav @place-data="addPlace" /> 
    <!-- Loop through the places array and pass each place to the WeatherInfo component -->
    <div v-for="(place, idx) in places" :key="idx">
      <!-- This is the WeatherInfo component -->
      <WeatherInfo :place="place" @remove-place="removePlace" /> 
    </div>
  </div>

</template>
