<template>
  <div>
    <button type="button" @click="enterAddItemMode">Add Item</button>
    <table v-if="allItems.length" class="inventory-list">
      <thead>
        <tr>
          <th>Name</th>
          <th>Rarity</th>
          <th>Gachapon</th>
          <th>Stocked</th>
          <th>Purchased</th>
          <th colspan="2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <InventoryItem v-for="item in allItems" :key="item.id" :item="item" />
      </tbody>
    </table>
    <p v-else>No items found</p>
  </div>
</template>

<script setup lang="ts">
import InventoryItem from '@/components/InventoryItem.vue';
import { allItems, enterAddItemMode } from '@/composables/useItem';
</script>
