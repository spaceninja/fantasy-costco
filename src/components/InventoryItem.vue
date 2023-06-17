<template>
  <tr>
    <td
      :class="[
        { 'is-purchased': item.purchased },
        { 'is-stocked': item.stocked },
      ]"
    >
      {{ item.name }}
    </td>
    <td>
      {{ item.rarity }}
    </td>
    <td>
      <input type="checkbox" :checked="item.gachapon" disabled />
    </td>
    <td>
      <input type="checkbox" :checked="item.stocked" disabled />
    </td>
    <td>
      <input type="checkbox" :checked="item.purchased" disabled />
    </td>
    <td>
      <button @click="showConfirm">⛔️</button>
    </td>
    <td>
      <button @click="enterEditBookMode(item)">✏️</button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { type Item } from '@/types/Item';
import { deleteItem, enterEditBookMode } from '@/composables/useItem';

const props = defineProps<{
  item: Item;
}>();

const showConfirm = () => {
  const confirmed = confirm('Are you sure you want to delete this item?');
  if (confirmed) {
    deleteItem(props.item.id);
  }
};
</script>
