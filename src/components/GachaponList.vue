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
        <button type="button" @click="setCurrentGachaponItem(item)">
          {{ item.name }}
        </button>
      </li>
    </ol>
    <p v-else>Sorry, we have nothing in stock!</p>
    <button type="button" @click="getRandomGachaponItems()">Restock</button>
    <button type="button" @click="saveGachaponItems(currentGachaponItems)">
      Save
    </button>
    <ItemDetail
      v-if="currentGachaponItem"
      :key="currentGachaponItem.id"
      :item="currentGachaponItem"
    />
  </div>
</template>

<script setup lang="ts">
import ItemDetail from '@/components/ItemDetail.vue';
import {
  currentGachaponItems,
  currentGachaponItem,
  getRandomGachaponItems,
  saveGachaponItems,
  setCurrentGachaponItem,
} from '@/composables/useGachapon';
</script>
