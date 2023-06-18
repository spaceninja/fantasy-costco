<template>
  <div>
    <h3>Front Room</h3>
    <template v-if="currentFrontRoomItems.length">
      <ItemDetail
        v-for="item in currentFrontRoomItems"
        :key="item.id"
        :item="item"
      />
    </template>
    <p v-else>Sorry, we have nothing in stock!</p>
    <div v-if="userSession">
      <button type="button" @click="getRandomFrontRoomItems()">Restock</button>
      <button type="button" @click="saveFrontRoomItems(currentFrontRoomItems)">
        Save
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemDetail from '@/components/ItemDetail.vue';
import { userSession } from '@/composables/useAuth';
import {
  currentFrontRoomItems,
  getRandomFrontRoomItems,
  saveFrontRoomItems,
} from '@/composables/useFrontRoom';
</script>
