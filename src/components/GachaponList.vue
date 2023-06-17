<template>
  <div>
    <h3>Gachapon</h3>
    <ol v-if="gachaponItems.length">
      <li
        v-for="item in gachaponItems"
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
    <button type="button" @click="gachaponItems = getRandomGachaponItems()">
      Spin
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getRandomGachaponItems } from '@/composables/useItem';
import { type Item } from '@/types/Item';

const gachaponItems = ref<Item[]>([]);
</script>
