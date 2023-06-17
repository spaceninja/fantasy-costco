<template>
  <div>
    <h3>Front Room</h3>
    <ol v-if="currentFrontRoomItems.length">
      <li
        v-for="item in currentFrontRoomItems"
        :key="item.id"
        :class="[
          { 'is-purchased': item.purchased },
          { 'is-stocked': item.stocked },
        ]"
      >
        {{ item.name }}, {{ item.rarity }}
      </li>
    </ol>
    <p v-else>Sorry, we have nothing in stock!</p>
    <button type="button" @click="getRandomFrontRoomItems()">Restock</button>
    <button type="button" @click="saveFrontRoomItems(currentFrontRoomItems)">
      Save
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  currentFrontRoomItems,
  getRandomFrontRoomItems,
  saveFrontRoomItems,
} from '@/composables/useItem';
</script>
