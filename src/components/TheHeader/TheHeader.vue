<template>
  <h1>Fantasy Costco</h1>
  <nav>
    <button v-if="userSession" type="button" @click="handleLogout">
      Sign Out
    </button>
  </nav>
</template>

<script setup lang="ts">
import { userSession, handleLogout } from '@/composables/useAuth';
</script>

<style lang="scss">
@import './TheHeader';
</style>
