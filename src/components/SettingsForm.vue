<template>
  <div>
    <h2>Settings</h2>
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
    <p>
      Share this link with your players to let them shop at your store:<br />
      <code>{{ domain }}/?store={{ userSession?.uid }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { settings, saveSettings } from '@/composables/useSettings';
import { userSession } from '@/composables/useAuth';

// Get the domain name
const domain = window.location.origin;
</script>
