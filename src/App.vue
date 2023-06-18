<template>
  <TheHeader />
  <ThePublicShop v-if="storeId" :store-id="storeId" />
  <TheShop v-else-if="userSession" />
  <TheClosedSign v-else />
  <TheFooter />
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import ThePublicShop from '@/components/pages/ThePublicShop.vue';
import TheShop from '@/components/TheShop.vue';
import TheClosedSign from '@/components/pages/TheClosedSign.vue';
import TheFooter from '@/components/TheFooter.vue';
import { userSession } from '@/composables/useAuth';
import { storeId } from '@/composables/usePublicShop';

// Check if store ID URL parameter has been provided
const urlParams = new URLSearchParams(window.location.search);
storeId.value = urlParams.get('store');
</script>
