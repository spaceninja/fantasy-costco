<template>
  <div>
    <h3>Front Room</h3>
    <ol v-if="frontRoomItems.length">
      <li
        v-for="item in frontRoomItems"
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
    <button type="button" @click="restock">Spin</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getRandomFrontRoomItemsByRarity } from '@/composables/useItem';
import { type Item } from '@/types/Item';

const commonItems = ref<Item[]>([]);
const uncommonItems = ref<Item[]>([]);
const rareItems = ref<Item[]>([]);
const veryRareItems = ref<Item[]>([]);
const legendaryItems = ref<Item[]>([]);

const frontRoomItems = computed(() => {
  return [
    ...commonItems.value,
    ...uncommonItems.value,
    ...rareItems.value,
    ...veryRareItems.value,
    ...legendaryItems.value,
  ];
});

const restock = () => {
  commonItems.value = getRandomFrontRoomItemsByRarity('common', 6);
  uncommonItems.value = getRandomFrontRoomItemsByRarity('uncommon', 6);
  rareItems.value = getRandomFrontRoomItemsByRarity('rare', 4);
  veryRareItems.value = getRandomFrontRoomItemsByRarity('very-rare', 2);
  legendaryItems.value = getRandomFrontRoomItemsByRarity('legendary', 1);
};
</script>
