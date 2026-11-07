<script setup lang="ts">
withDefaults(defineProps<{ name?: string; size?: number }>(), {
  name: 'arrow',
  size: 20,
})
const paths: Record<string, string> = {
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  back: 'M19 12H5m6-6-6 6 6 6',
  chevron: 'm9 5 7 7-7 7',
  down: 'm6 9 6 6 6-6',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12M6 18 18 6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M20.8 13a9 9 0 1 1-9.8-9.8A7 7 0 0 0 20.8 13',
  start: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm13 0v6m-3-3h6',
  ai: 'M8 3v3m8-3v3M8 18v3m8-3v3M3 8h3m-3 8h3m12-8h3m-3 8h3M7 6h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1m3 4h4v4h-4z',
  git: 'M6 5v10a4 4 0 0 0 4 4h3M6 9h8a4 4 0 0 0 4-4M8 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0m12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-3 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  frontend: 'M3 4h18v16H3zM3 9h18M7 6.5h.01M10 6.5h.01m1 6-3 3 3 3m3-6 3 3-3 3',
  controls:
    'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 3a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
  cross: 'M8 3h8v6H8zM3 15h7v6H3zm11 0h7v6h-7zM12 9v3m-6 3v-3h12v3',
  backend: 'M4 3h16v7H4zm0 11h16v7H4zm4-7h.01M8 18h.01M12 7h5m-5 11h5',
  quality: 'm12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6zm-4 10 3 3 5-6',
  growth: 'M4 20h16M6 16l5-6 4 3 5-8m-5 0h5v5',
  book: 'M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1m0-15c3-2 6-2 9-1v15c-3-1-6-1-9 1V5',
  lab: 'M9 3h6m-5 0v6l-6 10a1.3 1.3 0 0 0 1 2h14a1.3 1.3 0 0 0 1-2L14 9V3M7 15h10',
  route: 'M6 4h11a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h11M6 2v4m12 8v6m-3-3 3 3 3-3',
  play: 'm9 5 10 7-10 7z',
  copy: 'M8 8h12v13H8zM16 8V3H3v13h5',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
  github:
    'M9 20c-4 1-4-2-6-2m12 4v-4c0-1-.3-2-1-2 4-.5 6-2 6-6 0-1-.5-3-1.5-4 .2-1 .2-2-.3-3-2 0-3 1-3 1-2-.5-4-.5-6 0 0 0-1-1-3-1-.5 1-.5 2-.3 3C4.5 7 4 9 4 10c0 4 2 5.5 6 6-.7.5-1 1-1 2v4',
  reset: 'M3 11a9 9 0 1 1 3 8M3 4v7h7',
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] ?? paths.book" />
  </svg>
</template>
