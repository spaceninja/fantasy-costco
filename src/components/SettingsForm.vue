<template>
  <div>
    <form @submit.prevent="saveSettings(settings)">
      <div class="form__group">
        <label for="item-name">Shop Name</label>
        <input
          id="item-name"
          v-model="settings.shopName"
          type="text"
          required
        />
      </div>
      <div class="form__group">
        <button type="submit">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { settings, saveSettings } from '@/composables/useSettings';
</script>
