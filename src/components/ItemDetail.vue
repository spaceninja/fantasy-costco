<template>
  <article>
    <h2>{{ item.name }}, {{ price }}gp</h2>
    <p>
      <em>
        {{ friendlyCategory(item.category)
        }}<span v-if="item.categoryNotes" class="lowercase">
          ({{ item.categoryNotes }})</span
        >,
        {{ friendlyRarity(item.rarity) }}
        <span v-if="item.attunement">
          (requires attunement<span v-if="item.restrictions" class="lowercase">
            by {{ item.restrictions }}</span
          >)
        </span>
      </em>
    </p>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="htmlDescription" />
    <p v-if="item.source">
      <a :href="item.source" target="_blank" rel="noopener noreferrer"
        >source</a
      >
      ({{ isOfficial ? 'official' : 'homebrew' }})
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import {
  friendlyCategory,
  friendlyRarity,
  getPriceByRarity,
} from '@/composables/useItem';
import { type Item } from '@/types/Item';

const props = defineProps<{
  item: Item;
}>();

const htmlDescription = computed(() =>
  marked(props.item.description, {
    headerIds: false,
    mangle: false,
  })
);

const isOfficial = computed(() => props.item.source?.includes('dndbeyond.com'));

const price = computed(() => getPriceByRarity(props.item.rarity));
</script>
