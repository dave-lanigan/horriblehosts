<script setup lang="ts">
import { useAuth } from '@clerk/nuxt/composables'
import { SignInButton, UserButton } from '@clerk/nuxt/components'
import { Button } from '~/components/ui/button'

const { isLoaded, isSignedIn } = useAuth()
</script>

<template>
  <span v-if="!isLoaded" class="text-sm text-muted-foreground" role="status">Loading account…</span>
  <UserButton v-else-if="isSignedIn" />
  <SignInButton v-else mode="modal">
    <Button variant="ghost" class="sign-in-link min-h-11">Sign in</Button>
  </SignInButton>
</template>
