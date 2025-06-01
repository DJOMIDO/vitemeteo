<script setup>
defineProps({
    lastUpdated: String,
    locationName: String
})

const emit = defineEmits(['remove-place'])

const handleRemove = () => {
    emit('remove-place', locationName)
}
</script>

<template>
    <!-- This is the flex container for the last updated time -->
    <div class="mt-8 text-center mb-6 text-white">
        <h3 class="mb-4">
            Dernière mise à jour : {{ lastUpdated }}
            sur <a href="https://www.weatherapi.com" target="_blank"
                class="underline hover:text-blue-400">weatherapi.com</a>
        </h3>

        <!-- This is the button to remove the place from the list -->
        <button @click="handleRemove"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center gap-2">
            <i class="fa fa-trash"></i>
            Supprimer cette ville
        </button>
    </div>
</template>
