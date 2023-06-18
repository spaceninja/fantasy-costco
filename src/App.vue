<template>
  <TheHeader />
  <ThePublicShop v-if="storeId" :store-id="storeId" />
  <TheShop v-else-if="userSession" />
  <template v-else>
    <h2>Sorry, the shop is closed right now.</h2>
    <p>Players: Please follow the link your DM gave you to visit your store.</p>
    <p>DMs: Please sign in to manage your store.</p>
  </template>
  <TheFooter />
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import ThePublicShop from '@/components/ThePublicShop.vue';
import TheShop from '@/components/TheShop.vue';
import TheFooter from '@/components/TheFooter.vue';
import { userSession } from '@/composables/useAuth';

const urlParams = new URLSearchParams(window.location.search);
const storeId = urlParams.get('store');
</script>
