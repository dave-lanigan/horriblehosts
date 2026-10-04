<template>
  <NuxtPwaManifest />
  <NuxtRouteAnnouncer />
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <div class="header-inner">
      <NuxtLink to="/" class="brand" aria-label="HorribleHosts home">
        <img src="/favicon.svg" width="34" height="34" alt="">
        <span>horrible<span class="brand-accent">hosts</span><span class="brand-dot">.</span></span>
      </NuxtLink>
      <nav class="header-nav" aria-label="Main navigation">
        <NuxtLink to="/">Explore stories</NuxtLink>
        <NuxtLink to="/about">How it works</NuxtLink>
      </nav>
      <div class="header-actions">
        <ClientOnly>
          <AuthControls v-if="useRuntimeConfig().public.authEnabled" />
          <NuxtLink v-else to="/submit" class="sign-in-link">Sign in</NuxtLink>
        </ClientOnly>
        <Button as-child class="min-h-11">
          <NuxtLink to="/submit"><PenLine aria-hidden="true" /> <span>Share your story</span></NuxtLink>
        </Button>
      </div>
    </div>
  </header>
  <main id="main-content" tabindex="-1">
    <NuxtPage />
  </main>
  <footer class="site-footer">
    <div class="footer-inner">
      <p>Honest stories. Better stays.</p>
      <nav aria-label="Footer navigation">
        <NuxtLink to="/about">Community & privacy</NuxtLink>
        <ClientOnly><InstallApp /></ClientOnly>
      </nav>
      <span>Not affiliated with Airbnb or Vrbo.</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { PenLine } from '@lucide/vue'
import { Button } from '~/components/ui/button'
</script>
