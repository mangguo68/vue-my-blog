<script setup lang="ts">
const props = defineProps<{ class?: string }>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 120"
    fill="none"
    :class="['text-blog-primary/20 dark:text-blog-primary/30', props.class]"
    aria-hidden="true"
  >
    <path
      d="M40 95V45c0-5 4-9 9-9h102c5 0 9 4 9 9v50"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M49 36h82c3 0 5 2 5 5v45H44V41c0-2.8 2.2-5 5-5z"
      fill="currentColor"
      fill-opacity="0.08"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <path d="M60 55h80M60 65h60M60 75h70" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.5" />
    <circle cx="155" cy="75" r="18" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.5" />
    <path d="M155 68v14l6-6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  </svg>
</template>
