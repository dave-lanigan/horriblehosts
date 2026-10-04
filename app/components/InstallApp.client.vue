<script setup lang="ts">
import { Download } from '@lucide/vue'

interface InstallPrompt extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
const prompt = shallowRef<InstallPrompt>()
const installed = ref(false)
const dismissed = ref(false)
const nuxt = useNuxtApp()
function capture(event: Event) {
  event.preventDefault()
  prompt.value = event as InstallPrompt
}
function markInstalled() { installed.value = true; prompt.value = undefined }
onMounted(() => {
  installed.value = window.matchMedia('(display-mode: standalone)').matches
  window.addEventListener('beforeinstallprompt', capture)
  window.addEventListener('appinstalled', markInstalled)
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', capture)
  window.removeEventListener('appinstalled', markInstalled)
})
async function install() {
  if (!prompt.value) return
  await prompt.value.prompt()
  await prompt.value.userChoice
  prompt.value = undefined
}
</script>

<template>
  <button v-if="prompt && !installed" class="install-link" type="button" @click="install">
    <Download aria-hidden="true" /> Install app
  </button>
  <div v-if="nuxt.$pwa?.needRefresh && !dismissed" class="update-notice" role="status">
    <span>A new version is ready. Save any draft before updating.</span>
    <button type="button" @click="nuxt.$pwa?.updateServiceWorker()">Update</button>
    <button type="button" @click="dismissed = true">Later</button>
  </div>
</template>
