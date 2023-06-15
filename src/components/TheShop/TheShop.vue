<template>
  <EditForm v-if="editMode" />
  <template v-else>
    <div>Logged in, yo!!!</div>

    <ul v-if="allItems.length">
      <li v-for="item in allItems" :key="item.id">
        {{ item.name }}
        <button @click="deleteItem(item.id)">⛔️</button>
        <button @click="enterEditBookMode(item)">✏️</button>
      </li>
    </ul>
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
