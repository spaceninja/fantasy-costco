<template>
  <main>
    <button type="button" @click="handleGitHubLogin()">
      Sign in with GitHub
    </button>
  </main>
</template>

<script setup lang="ts">
import { handleGitHubLogin } from '@/composables/useAuth';
</script>
