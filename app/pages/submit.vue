<script setup lang="ts">
import { ShieldCheck, ArrowLeft } from '@lucide/vue'

useSeoMeta({ title: 'Share your story — HorribleHosts', robots: 'noindex' })
const authEnabled = useRuntimeConfig().public.authEnabled
</script>

<template>
  <div class="form-page">
    <NuxtLink to="/" class="back-link"><ArrowLeft aria-hidden="true" /> Back to stories</NuxtLink>
    <span class="eyebrow">YOUR EXPERIENCE MATTERS</span>
    <h1>Let’s hear your side.</h1>
    <p class="page-intro">Share what happened. Help another guest avoid the same surprise.</p>
    <div class="privacy-callout"><ShieldCheck aria-hidden="true" /><p><strong>Publicly anonymous, always.</strong> Your name and account details won't appear on your story. Avoid details that could identify you or another person.</p></div>
    <ClientOnly v-if="authEnabled">
      <ClerkSubmit />
      <template #fallback><p role="status">Loading secure sign-in…</p></template>
    </ClientOnly>
    <div v-else class="feed-message"><h2>Posting isn't configured yet.</h2><p>The site owner needs to add Clerk keys, a Turso database, and an author secret. You can still browse stories without an account.</p><NuxtLink to="/">Explore the stories</NuxtLink></div>
  </div>
</template>
