<template>
  <TheFrontRoom />
</template>

<script setup lang="ts">
import TheFrontRoom from '@/components/pages/TheFrontRoom.vue';
import { loadPublicFrontRoomItems } from '@/composables/usePublicShop';

const props = defineProps<{
  storeId: string;
}>();

// Load the public front room items for the store ID provided in the URL
loadPublicFrontRoomItems(props.storeId);
</script>
