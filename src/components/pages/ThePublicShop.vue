<template>
  <TheFrontRoom />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import TheFrontRoom from '@/components/pages/TheFrontRoom.vue';
import {
  loadPublicSettings,
  loadPublicFrontRoomItems,
} from '@/composables/usePublicShop';

const props = defineProps<{
  storeId: string;
}>();

// Load the public settings and front room items for the store ID provided in the URL
onMounted(() => {
  loadPublicSettings(props.storeId);
  loadPublicFrontRoomItems(props.storeId);
});
</script>
