<script setup lang="ts">
import { ArrowUpRight, MapPin, ShieldCheck } from '@lucide/vue'
import { Badge } from '~/components/ui/badge'
import type { Report } from '#shared/reports'

defineProps<{ report: Report; demo?: boolean }>()
function date(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value))
}
</script>

<template>
  <article class="story-card">
    <div class="story-meta">
      <span class="anonymous-avatar"><ShieldCheck aria-hidden="true" /></span>
      <div><span class="anonymous-name">Anonymous guest</span><span class="story-date">{{ date(report.createdAt) }}</span></div>
      <Badge variant="outline" class="platform-badge">{{ report.platform }}</Badge>
    </div>
    <h3><NuxtLink :to="`/stories/${report.id}`">{{ report.title }}</NuxtLink></h3>
    <p class="story-location"><MapPin aria-hidden="true" /> {{ report.location }}</p>
    <p class="story-excerpt">{{ report.body }}</p>
    <div class="story-bottom">
      <Badge variant="secondary">{{ report.category }}</Badge>
      <NuxtLink :to="`/stories/${report.id}`" class="read-story" :aria-label="`Read story: ${report.title}`">Read story <ArrowUpRight aria-hidden="true" /></NuxtLink>
    </div>
    <span v-if="demo" class="example-label">Fictional example · not a real review</span>
  </article>
</template>
