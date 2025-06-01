<script setup>
defineProps({
    astro: Object
})
</script>

<template>
    <div class="flex items-center gap-4 mb-8 text-lg">
        <!-- Sunrise -->
        <div class="flex items-center gap-2">
            <i class="fa fa-sun text-yellow-400"></i>
            <span>Lever du soleil : {{ astro.sunrise }}</span>
        </div>

        <!-- Sunset -->
        <div class="flex items-center gap-2">
            <i class="fa fa-moon text-indigo-300"></i>
            <span>Coucher du soleil : {{ astro.sunset }}</span>
        </div>
    </div>
</template>
