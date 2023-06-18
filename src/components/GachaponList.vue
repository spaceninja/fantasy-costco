<template>
  <div>
    <h3>Gachapon</h3>
    <ol v-if="currentGachaponItems.length">
      <li
        v-for="item in currentGachaponItems"
        :key="item.id"
        :class="[
          { 'is-purchased': item.purchased },
          { 'is-stocked': item.stocked },
        ]"
      >
        {{ item.name }}
      </li>
    </ol>
    <p v-else>Sorry, we have nothing in stock!</p>
    <button type="button" @click="getRandomGachaponItems()">Restock</button>
    <button type="button" @click="saveGachaponItems(currentGachaponItems)">
      Save
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  currentGachaponItems,
  getRandomGachaponItems,
  saveGachaponItems,
} from '@/composables/useGachapon';
</script>
