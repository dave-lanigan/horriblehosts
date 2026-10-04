<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
useSeoMeta({ title: 'Community & privacy — HorribleHosts' })
</script>

<template>
  <div class="article-page policy-page">
    <NuxtLink to="/" class="back-link"><ArrowLeft aria-hidden="true" /> Back to stories</NuxtLink>
    <span class="eyebrow">GOOD INFORMATION. BETTER TRIPS.</span>
    <h1>Honest stories,<br>without the public profile.</h1>
    <p class="page-intro">HorribleHosts is an independent place to share first-hand experiences with Airbnb and Vrbo hosts. Every story is free to read, with or without an account.</p>
    <section><h2>How it works</h2><ol><li>Browse or search public stories—no account needed.</li><li>Sign in securely with Clerk to share your own experience.</li><li>Choose a platform and category, remove identifying details, and publish.</li></ol></section>
    <section><h2>What “anonymous” means here</h2><p>We never display your account, name, avatar, email, or a public author profile alongside a story. Our report database stores a keyed, pseudonymous author identifier for abuse prevention, not your raw Clerk user ID. This is public anonymity, not complete technical anonymity.</p><p>Clerk processes your account information. The hosting and database providers may process technical request information. The site operator controls the author-secret key and may be able to associate a report with an account. We cannot guarantee protection from recognition, retaliation, legal requests, or details you reveal yourself.</p><p>Don't include personal names, phone numbers, email addresses, exact addresses, booking references, or details that identify guests. City, country, and month are enough. Reports are public and may be copied or indexed by search engines.</p></section>
    <section><h2>Keep the community useful</h2><ul><li>Share only your own truthful, first-hand experience.</li><li>Describe specific events and distinguish facts from opinions.</li><li>No threats, harassment, discrimination, doxxing, or private information.</li><li>No advertisements, duplicates, or fabricated allegations.</li><li>Keep communication and payments with hosts on the booking platform.</li></ul><p>Stories are guest accounts, not independently verified findings. This site is not a substitute for platform support or emergency services.</p></section>
    <section><h2>Accounts, storage, and corrections</h2><p>Authentication uses Clerk. Reports are stored in Turso and remain public after sign-out. Posting is limited to five stories per account in a rolling 24-hour period. Account deletion through Clerk does not automatically remove published stories.</p><p>There is no self-service report editing or deletion in this version. Site operators should provide a monitored support channel before public launch and handle removal and correction requests through the database. Do not submit information you may need to keep private.</p></section>
    <section><h2>Install it on your phone</h2><p>In Chrome on Android, open the browser menu and choose “Install app” or “Add to Home screen.” An install button also appears here when Chrome offers installation. On iPhone, use Safari's Share menu, then “Add to Home Screen.” Installation requires HTTPS, except on localhost.</p><p>An internet connection is required for stories and sign-in. The offline cache contains only static app assets and a connection reminder—not reports or account information.</p></section>
    <section><h2>Independent by design</h2><p>HorribleHosts is not affiliated with, endorsed by, or operated by Airbnb or Vrbo. Their names identify the booking platforms discussed by guests.</p></section>
  </div>
</template>
