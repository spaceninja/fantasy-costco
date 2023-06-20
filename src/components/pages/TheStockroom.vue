<template>
  <div class="inventory">
    <InventoryStats class="inventory__stats" />
    <InventoryList class="inventory__list" />
  </div>
</template>

<script setup lang="ts">
import InventoryStats from '@/components/InventoryStats.vue';
import InventoryList from '@/components/InventoryList.vue';
</script>
