<script setup lang="ts">
import { ArrowRight, BookOpen, Search, ShieldCheck, MessageSquareText, Globe, LockKeyhole, SlidersHorizontal, X } from '@lucide/vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { categories, type ReportFeed } from '#shared/reports'

const search = ref('')
const q = ref('')
const platform = ref('')
const category = ref('')
const sort = ref('newest')
const page = ref(1)
watch([q, platform, category, sort], () => { page.value = 1 })
const query = computed(() => ({ q: q.value, platform: platform.value, category: category.value, sort: sort.value, page: page.value }))
const { data, status, error, refresh } = await useFetch<ReportFeed>('/api/reports', { query })
const activeFilters = computed(() => Boolean(q.value || platform.value || category.value))
function clear() {
  search.value = ''; q.value = ''; platform.value = ''; category.value = ''
}
function find() { q.value = search.value.trim() }
</script>

<template>
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-copy">
        <span class="eyebrow"><span class="eyebrow-dot" /> A little honesty goes a long way</span>
        <h1>Great trips.<br>Not-so-great <em>hosts.</em></h1>
        <p>The other side of the five-star review. Real guest experiences with Airbnb and Vrbo hosts, shared anonymously.</p>
        <div class="hero-buttons">
          <Button as-child class="min-h-12"><NuxtLink to="/submit">Share your story <ArrowRight aria-hidden="true" /></NuxtLink></Button>
          <a href="#stories" class="browse-link">Explore the stories <ArrowRight aria-hidden="true" /></a>
        </div>
        <div class="hero-reassurance"><ShieldCheck aria-hidden="true" /><span>No public profiles. No names. Just your experience.</span></div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="art-dot-grid" />
        <div class="art-note art-note-back"><span>THE LISTING</span><p>“Your perfect<br>home away<br>from home.”</p><span>★★★★★</span></div>
        <div class="art-note art-note-front"><span>THE REALITY</span><MessageSquareText /><p>There’s more<br>to the story.</p><div class="art-note-line" /><small>And it deserves to be heard.</small></div>
        <div class="art-stamp"><ShieldCheck /><span>GUEST<br>VOICES FIRST</span></div>
      </div>
    </div>
  </section>

  <div class="trust-strip">
    <span><ShieldCheck aria-hidden="true" /> Publicly anonymous</span>
    <span><BookOpen aria-hidden="true" /> Always free to read</span>
    <span><Globe aria-hidden="true" /> Airbnb & Vrbo experiences</span>
  </div>

  <div id="stories" class="explore-layout">
    <aside class="explore-sidebar">
      <div class="sidebar-heading">EXPLORE</div>
      <button class="sidebar-item" :class="{ selected: !platform }" type="button" @click="platform = ''"><BookOpen aria-hidden="true" /> All stories <span>{{ data?.stats.total ?? '—' }}</span></button>
      <button class="sidebar-item" :class="{ selected: platform === 'Airbnb' }" type="button" @click="platform = 'Airbnb'"><span class="platform-letter">A</span> Airbnb <span>{{ data?.stats.airbnb ?? '—' }}</span></button>
      <button class="sidebar-item" :class="{ selected: platform === 'Vrbo' }" type="button" @click="platform = 'Vrbo'"><span class="platform-letter">V</span> Vrbo <span>{{ data?.stats.vrbo ?? '—' }}</span></button>
      <div class="sidebar-divider" />
      <div class="sidebar-heading">WHAT WENT WRONG?</div>
      <button v-for="item in categories" :key="item" class="category-item" :class="{ selected: category === item }" type="button" :aria-pressed="category === item" @click="category = category === item ? '' : item">{{ item }}</button>
      <div class="sidebar-callout">
        <LockKeyhole aria-hidden="true" /><h3>Your voice matters.</h3>
        <p>Your account never appears on your story. Keep personal details out, too.</p>
        <NuxtLink to="/about">How anonymity works <ArrowRight aria-hidden="true" /></NuxtLink>
      </div>
    </aside>

    <section class="stories-section" aria-labelledby="stories-heading">
      <div class="section-heading"><div><span class="eyebrow">THE COMMUNITY JOURNAL</span><h2 id="stories-heading">Every stay has a story.</h2><p>Learn from someone else’s “never again.”</p></div><span class="story-count">{{ data?.total ?? 0 }} {{ data?.demo ? 'examples' : 'stories' }}</span></div>
      <div v-if="data?.demo" class="demo-notice" role="status">You're viewing fictional examples. Connect Turso to see and publish real community stories.</div>
      <div class="feed-toolbar">
        <form class="search-form" role="search" @submit.prevent="find">
          <label class="sr-only" for="story-search">Search stories by keyword or location</label>
          <Search aria-hidden="true" />
          <Input id="story-search" v-model="search" placeholder="Search stories, cities, experiences…" maxlength="100" />
          <Button type="submit" variant="ghost" aria-label="Search stories" class="min-h-11">Search</Button>
        </form>
        <label class="sort-label"><SlidersHorizontal aria-hidden="true" /><span class="sr-only">Sort stories</span><select v-model="sort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
      </div>
      <div class="mobile-filters">
        <label>Platform<select v-model="platform"><option value="">All platforms</option><option>Airbnb</option><option>Vrbo</option></select></label>
        <label>Category<select v-model="category"><option value="">All categories</option><option v-for="item in categories" :key="item">{{ item }}</option></select></label>
      </div>
      <div v-if="activeFilters" class="filter-summary"><span>Filtered stories{{ q ? ` for “${q}”` : '' }}</span><button type="button" @click="clear">Clear filters <X aria-hidden="true" /></button></div>
      <div v-if="error" class="feed-message" role="alert"><h3>We couldn't load the stories.</h3><p>Please try again in a moment.</p><Button variant="outline" @click="refresh()">Try again</Button></div>
      <div v-else-if="status === 'pending'" class="feed-message" role="status">Finding stories…</div>
      <div v-else-if="!data?.reports.length" class="feed-message"><BookOpen aria-hidden="true" /><h3>{{ activeFilters ? 'No stories match just yet.' : 'Be the first to tell your story.' }}</h3><p>{{ activeFilters ? 'Try another city or clear your filters.' : 'Your experience could help someone plan a better trip.' }}</p><Button v-if="activeFilters" variant="outline" @click="clear">Clear filters</Button><Button v-else as-child><NuxtLink to="/submit">Share your story</NuxtLink></Button></div>
      <div v-else class="story-grid"><ReportCard v-for="report in data.reports" :key="report.id" :report="report" :demo="data.demo" /></div>
      <nav v-if="data && data.total > data.pageSize" class="pagination" aria-label="Story pages">
        <Button variant="outline" :disabled="page <= 1" @click="page--">Previous</Button>
        <span aria-live="polite">Page {{ page }} of {{ Math.ceil(data.total / data.pageSize) }}</span>
        <Button variant="outline" :disabled="page * data.pageSize >= data.total" @click="page++">Next</Button>
      </nav>
      <div class="journal-note"><ShieldCheck aria-hidden="true" /><p>Stories are personal guest accounts, not independently verified facts.<br>Be thoughtful. Be honest. Help the next traveler.</p></div>
    </section>
  </div>
</template>
