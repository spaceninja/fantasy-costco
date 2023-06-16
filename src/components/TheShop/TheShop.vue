<template>
  <EditForm v-if="editMode" />
  <template v-else>
    <ol v-if="allItems.length">
      <li
        v-for="item in allItems"
        :key="item.id"
        :class="[
          { 'is-purchased': item.purchased },
          { 'is-stocked': item.stocked },
          { 'is-gachapon': item.gachapon },
        ]"
      >
        {{ item.name }}, {{ item.rarity }}
        <button @click="deleteItem(item.id)">⛔️</button>
        <button @click="enterEditBookMode(item)">✏️</button>
      </li>
    </ol>
    <p v-else>No items found</p>

    <button type="button" @click="enterAddBookMode">Add Item</button>
  </template>
</template>

<script setup lang="ts">
import EditForm from '@/components/EditForm/EditForm.vue';
import {
  allItems,
  deleteItem,
  editMode,
  enterAddBookMode,
  enterEditBookMode,
} from '@/composables/useItem';
</script>

<style lang="scss">
@import './TheShop';
</style>
