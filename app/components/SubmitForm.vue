<script setup lang="ts">
import { ArrowRight, LoaderCircle } from '@lucide/vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { categories, platforms, validateReport, type Report } from '#shared/reports'

const form = reactive({ title: '', location: '', platform: 'Airbnb', category: '', stayMonth: '', body: '', consent: false })
const pending = ref(false)
const error = ref('')
const errorBox = useTemplateRef('errorBox')
const maxMonth = new Date().toISOString().slice(0, 7)
async function submit() {
  if (pending.value) return
  error.value = ''
  try {
    const body = validateReport(form)
    pending.value = true
    const result = await $fetch<{ report: Report }>('/api/reports', { method: 'POST', body })
    await navigateTo(`/stories/${result.report.id}`)
  } catch (failure) {
    const response = failure as { data?: { message?: string }; message?: string }
    error.value = response.data?.message || response.message || 'Your story could not be posted. Please try again.'
    await nextTick()
    errorBox.value?.focus()
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="report-form" @submit.prevent="submit">
    <div v-if="error" ref="errorBox" tabindex="-1" class="form-error" role="alert">{{ error }}</div>
    <fieldset :disabled="pending">
      <legend class="sr-only">Your guest experience</legend>
      <div class="form-field"><label for="report-title">Give your story a title</label><Input id="report-title" v-model="form.title" required minlength="10" maxlength="120" placeholder="What should the next guest know?" /><small>10–120 characters. Please don't include personal names.</small></div>
      <div class="form-row">
        <div class="form-field"><label for="report-platform">Booking platform</label><select id="report-platform" v-model="form.platform" required><option v-for="platform in platforms" :key="platform">{{ platform }}</option></select></div>
        <div class="form-field"><label for="report-category">What went wrong?</label><select id="report-category" v-model="form.category" required><option disabled value="">Choose a category</option><option v-for="category in categories" :key="category">{{ category }}</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-field"><label for="report-location">City and country</label><Input id="report-location" v-model="form.location" required minlength="3" maxlength="100" placeholder="e.g. Lisbon, Portugal" /><small>No street addresses or precise locations.</small></div>
        <div class="form-field"><label for="report-month">When did you stay?</label><Input id="report-month" v-model="form.stayMonth" type="month" required min="2000-01" :max="maxMonth" /></div>
      </div>
      <div class="form-field"><label for="report-body">Your story</label><Textarea id="report-body" v-model="form.body" required minlength="80" maxlength="5000" rows="9" placeholder="Tell us what was promised, what happened, and how the host responded. Stick to your own first-hand experience." /><small>{{ form.body.length }} / 5,000 characters · minimum 80</small></div>
      <label class="consent-label"><input v-model="form.consent" type="checkbox" required><span>This is my truthful, first-hand experience. I have removed names, contact details, booking references, and identifying information. I agree to the <NuxtLink to="/about" target="_blank" rel="noopener">community guidelines and privacy information</NuxtLink>.</span></label>
      <Button type="submit" :disabled="pending" class="min-h-12"><LoaderCircle v-if="pending" class="animate-spin" aria-hidden="true" /><span>{{ pending ? 'Publishing…' : 'Publish anonymously' }}</span><ArrowRight v-if="!pending" aria-hidden="true" /></Button>
    </fieldset>
    <p class="form-footnote">Stories are public. Please review carefully before publishing. Do not include sensitive information.</p>
  </form>
</template>
