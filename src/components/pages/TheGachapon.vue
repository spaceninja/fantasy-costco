<template>
  <div class="gachapon">
    <GachaponList class="gachapon__list" />
    <ItemDetail
      v-if="currentGachaponItem"
      :key="currentGachaponItem.id"
      :item="currentGachaponItem"
      class="gachapon__item-detail"
    />
  </div>
</template>

<script setup lang="ts">
import GachaponList from '@/components/GachaponList.vue';
import ItemDetail from '@/components/ItemDetail.vue';
import { currentGachaponItem } from '@/composables/useGachapon';
</script>
