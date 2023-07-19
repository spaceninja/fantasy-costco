<template>
  <ul>
    <li>{{ allItems.length }} items in inventory</li>
    <li>{{ unpurchasedItems.length }} unpurchased items</li>
    <li>{{ purchasedItems.length }} purchased items</li>
    <li>
      Unpurchased by rarity:
      <ul>
        <li>{{ commonItems.length }} common</li>
        <li>{{ uncommonItems.length }} uncommon</li>
        <li>{{ rareItems.length }} rare</li>
        <li>{{ veryRareItems.length }} very rare</li>
        <li>{{ legendaryItems.length }} legendary</li>
      </ul>
    </li>
    <li>
      Gachapon items:
      <ul>
        <li>{{ gachaponItems.length }} total</li>
        <li>{{ stockedGachaponIds.length }} stocked</li>
        <li>{{ unstockedGachaponIds.length }} unstocked</li>
      </ul>
    </li>
    <li>
      Front Room items:
      <ul>
        <li>{{ frontRoomItems.length }} total</li>
        <li>{{ stockedFrontRoomItems.length }} stocked</li>
        <li>{{ unstockedFrontRoomItems.length }} unstocked</li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {
  allItems,
  unpurchasedItems,
  purchasedItems,
  commonItems,
  uncommonItems,
  rareItems,
  veryRareItems,
  legendaryItems,
} from '@/composables/useItem';
import {
  gachaponItems,
  unstockedGachaponIds,
  stockedGachaponIds,
} from '@/composables/useGachapon';
import {
  frontRoomItems,
  stockedFrontRoomItems,
  unstockedFrontRoomItems,
} from '@/composables/useFrontRoom';
</script>
