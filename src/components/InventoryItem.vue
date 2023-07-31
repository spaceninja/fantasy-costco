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
      <input :checked="isGachapon" type="checkbox" @change="onGachaponChange" />
    </td>
    <td>
      <input type="checkbox" :checked="isStocked" @change="onStockedChange" />
    </td>
    <td>
      <input
        type="checkbox"
        :checked="isPurchased"
        @change="onPurchasedChange"
      />
    </td>
    <td>
      <button @click="showConfirm">⛔️</button>
    </td>
    <td>
      <button @click="enterEditItemMode(item)">✏️</button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type Item } from '@/types/Item';
import { editItem, deleteItem, enterEditItemMode } from '@/composables/useItem';

const props = defineProps<{
  item: Item;
}>();

const showConfirm = () => {
  const confirmed = confirm('Are you sure you want to delete this item?');
  if (confirmed) {
    deleteItem(props.item.id);
  }
};

const isGachapon = computed(() => props.item.gachapon);
const isStocked = computed(() => props.item.stocked);
const isPurchased = computed(() => props.item.purchased);

const onGachaponChange = () => {
  const updatedItem = {
    ...props.item,
    gachapon: !isGachapon.value,
  };
  editItem(updatedItem);
};

const onStockedChange = () => {
  const updatedItem = {
    ...props.item,
    stocked: !isStocked.value,
  };
  editItem(updatedItem);
};

const onPurchasedChange = () => {
  const updatedItem = {
    ...props.item,
    purchased: !isPurchased.value,
  };
  editItem(updatedItem);
};
</script>
