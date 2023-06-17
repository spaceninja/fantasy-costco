<template>
  <EditForm v-if="editMode" />
  <template v-else-if="userSession">
    <TheFrontRoom v-show="currentPage === 'frontroom'" />
    <TheGachapon v-show="currentPage === 'gachapon'" />
    <TheStockroom v-show="currentPage === 'stockroom'" />
  </template>
  <TheFrontRoom v-else />
</template>

<script setup lang="ts">
import EditForm from '@/components/EditForm.vue';
import TheFrontRoom from '@/components/pages/TheFrontRoom.vue';
import TheGachapon from '@/components/pages/TheGachapon.vue';
import TheStockroom from '@/components/pages/TheStockroom.vue';
import { userSession } from '@/composables/useAuth';
import { editMode } from '@/composables/useItem';
import { currentPage } from '@/composables/useNav';
</script>
