<template>
  <article class="magic-item">
    <h3 class="magic-item__title">
      {{ item.name
      }}<span v-if="!item.gachapon" class="magic-item__price"
        >, {{ price }}gp</span
      >
    </h3>
    <p class="magic-item__meta">
      <em>
        <span class="magic-item__category"
          >{{ friendlyCategory(item.category)
          }}<span
            v-if="item.categoryNotes"
            class="magic-item__category-notes lowercase"
          >
            ({{ item.categoryNotes }})</span
          ></span
        >,
        <span class="magic-item__rarity">
          {{ friendlyRarity(item.rarity) }}
        </span>
        <span v-if="item.attunement" class="magic-item__attunement">
          (requires attunement<span
            v-if="item.restrictions"
            class="magic-item__attunement-notes lowercase"
          >
            by {{ item.restrictions }}</span
          >)
        </span>
      </em>
    </p>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="magic-item__description" v-html="htmlDescription" />
    <div class="magic-item__extras">
      <p v-if="userSession" class="magic-item__actions">
        <button class="magic-item__purchase" @click="purchaseItem(item)">
          {{ item.purchased ? '✔︎ Purchased' : 'Purchase' }}
        </button>
      </p>
      <p v-if="item.source" class="magic-item__source">
        <a :href="item.source" target="_blank" rel="noopener noreferrer"
          >Source</a
        >
        ({{ isOfficial ? 'official' : 'homebrew' }})
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import { userSession } from '@/composables/useAuth';
import {
  friendlyCategory,
  friendlyRarity,
  getPriceByRarity,
  purchaseItem,
} from '@/composables/useItem';
import { type Item } from '@/types/Item';

const props = defineProps<{
  item: Item;
}>();

const htmlDescription = computed(() => marked(props.item.description));

const isOfficial = computed(() => props.item.source?.includes('dndbeyond.com'));

const price = computed(() => getPriceByRarity(props.item.rarity));
</script>
