<template>
  <div>
    <form
      @submit.prevent="
        editMode === 'add' ? addItem(currentItem) : editItem(currentItem)
      "
    >
      <input v-model="currentItem.id" type="hidden" />

      <label for="item-name">Item Name</label>
      <input id="item-name" v-model="currentItem.name" />

      <button type="submit">
        {{ editMode === 'add' ? 'Add Item' : 'Edit Item' }}
      </button>
      <button type="button" @click="exitEditMode">Cancel</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  currentItem,
  addItem,
  editItem,
  editMode,
  exitEditMode,
} from '@/composables/useItem';
</script>
