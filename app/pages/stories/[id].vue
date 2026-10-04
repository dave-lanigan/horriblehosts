<script setup lang="ts">
import { ArrowLeft, MapPin, ShieldCheck } from '@lucide/vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import type { Report } from '#shared/reports'

const route = useRoute()
const { data, error } = await useFetch<{ report: Report; demo: boolean }>(() => `/api/reports/${encodeURIComponent(String(route.params.id))}`)
if (error.value) {
  throw createError({ statusCode: error.value.statusCode || 500, statusMessage: error.value.statusCode === 404 ? 'Story not found' : 'Unable to load this story' })
}
useSeoMeta({
  title: () => `${data.value?.report.title ?? 'Story'} — HorribleHosts`,
  description: () => data.value?.report.body.slice(0, 160),
})
const stayDate = computed(() => data.value
  ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${data.value.report.stayMonth}-01T00:00:00Z`))
  : '')
</script>

<template>
  <div v-if="data" class="article-page">
    <NuxtLink to="/" class="back-link"><ArrowLeft aria-hidden="true" /> Back to stories</NuxtLink>
    <div v-if="data.demo" class="demo-notice">Fictional example — not a real guest review.</div>
    <article class="full-story">
      <div class="flex flex-wrap gap-2"><Badge variant="outline">{{ data.report.platform }}</Badge><Badge variant="secondary">{{ data.report.category }}</Badge></div>
      <h1>{{ data.report.title }}</h1>
      <div class="article-meta"><span><ShieldCheck aria-hidden="true" /> Anonymous guest</span><span><MapPin aria-hidden="true" /> {{ data.report.location }}</span><span>Stayed {{ stayDate }}</span></div>
      <div class="article-body">{{ data.report.body }}</div>
      <p class="article-disclaimer">This is a personal guest account, not an independently verified finding. No author's name or account information is shown.</p>
    </article>
    <div class="article-cta"><h2>Have a story of your own?</h2><p>Help the next guest make a more informed choice.</p><Button as-child class="min-h-11"><NuxtLink to="/submit">Share your story</NuxtLink></Button></div>
  </div>
</template>
