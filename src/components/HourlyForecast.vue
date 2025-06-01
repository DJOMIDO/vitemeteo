<script setup>
defineProps({
    hours: Array
})
</script>

<template>
    <div class="max-w-screen-md w-full py-12">
        <div class="mx-8 text-white text-center">
            <h2 class="mb-4 text-2xl font-semibold">Prévisions horaires</h2>
            <div class="flex gap-10 overflow-x-auto scrollbar-thin pb-2">
                <div v-for="(hour, index) in hours" :key="index" class="flex flex-col gap-2 items-center min-w-[60px]">
                    <!-- Time -->
                    <p class="whitespace-nowrap text-md">
                        {{ new Date(hour.time).toLocaleTimeString("fr", { hour: '2-digit' }) }}
                    </p>
                    <!-- Icon -->
                    <img class="w-auto h-[50px] object-cover" :src="hour.condition.icon" alt="icon" />
                    <!-- Temperature -->
                    <p class="text-xl">
                        {{ Math.round(hour.temp_c) }}&deg;
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
