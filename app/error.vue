<script setup lang="ts">
import type { NuxtError } from '#app'
import { Button } from '~/components/ui/button'
defineProps<{ error: NuxtError }>()
</script>

<template>
  <main class="form-page feed-message">
    <span class="eyebrow">HORRIBLEHOSTS</span>
    <h1>{{ error.statusCode === 404 ? 'This story isn’t here.' : 'A little unexpected turbulence.' }}</h1>
    <p>{{ error.statusCode === 404 ? 'The page may have moved or the story may no longer be available.' : 'Something went wrong. Please try again in a moment.' }}</p>
    <Button class="min-h-11" @click="clearError({ redirect: '/' })">Back to stories</Button>
  </main>
</template>
