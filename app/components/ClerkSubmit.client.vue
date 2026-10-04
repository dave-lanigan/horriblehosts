<script setup lang="ts">
import { useAuth } from '@clerk/nuxt/composables'
import { SignInButton } from '@clerk/nuxt/components'
import { Button } from '~/components/ui/button'

const { isLoaded, isSignedIn } = useAuth()
</script>

<template>
  <p v-if="!isLoaded" role="status">Loading secure sign-in…</p>
  <SubmitForm v-else-if="isSignedIn" />
  <div v-else class="feed-message">
    <h2>A private account. A public story.</h2>
    <p>Sign in to post. Your account helps limit spam, but your identity never appears on public reports. Browsing is always free.</p>
    <SignInButton mode="modal"><Button class="min-h-11">Sign in to share</Button></SignInButton>
  </div>
</template>
