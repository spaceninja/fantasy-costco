<template>
  <div>
    <form
      @submit.prevent="
        editMode === 'add' ? addItem(currentItem) : editItem(currentItem)
      "
    >
      <input v-model="currentItem.id" type="hidden" />

      <div class="form__group">
        <label for="item-name">Name</label>
        <input id="item-name" v-model="currentItem.name" type="text" required />
      </div>
      <div class="form__group">
        <label for="item-category">Category</label>
        <select id="item-category" v-model="currentItem.category" required>
          <option value="">—</option>
          <option value="armor">Armor</option>
          <option value="potion">Potion</option>
          <option value="ring">Ring</option>
          <option value="rod">Rod</option>
          <option value="scroll">Scroll</option>
          <option value="staff">Staff</option>
          <option value="wand">Wand</option>
          <option value="weapon">Weapon</option>
          <option value="wonderous">Wonderous Item</option>
        </select>
      </div>
      <div class="form__group">
        <label for="item-category-notes">Category notes</label>
        <input
          id="item-category-notes"
          v-model="currentItem.categoryNotes"
          type="text"
          placeholder="e.g. sword"
        />
        <small class="form__help">
          Anything you put here will be displayed in parentheses after the
          category. Useful to specify the type of armor or weapon.
        </small>
      </div>
      <div class="form__group">
        <label for="item-rarity">Rarity</label>
        <select id="item-rarity" v-model="currentItem.rarity" required>
          <option value="">—</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="very-rare">Very Rare</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>
      <div class="form__group">
        <label for="item-description">Description</label>
        <textarea
          id="item-description"
          v-model="currentItem.description"
          required
        />
      </div>
      <div class="form__group">
        <input
          id="item-attunement"
          v-model="currentItem.attunement"
          type="checkbox"
        />
        <label for="item-attunement">Requires attunement?</label>
      </div>
      <div class="form__group">
        <label for="item-restrictions">Attunement restrictions</label>
        <input
          id="item-restrictions"
          v-model="currentItem.restrictions"
          type="text"
          placeholder="e.g., a spellcaster"
        />
        <small class="form__help">
          If the item requires attunement by a certain class, you can specify
          that here, and it will be added. For example, if you write "a
          spellcaster", then the displayed text will be "requires attunement by
          a spellcaster."
        </small>
      </div>
      <div class="form__group">
        <input
          id="item-stocked"
          v-model="currentItem.stocked"
          type="checkbox"
        />
        <label for="item-stocked">In stock?</label>
        <small class="form__help">
          Mark an item as stocked to force it to be included in the shop or
          gachapon machine.
        </small>
      </div>
      <div class="form__group">
        <input
          id="item-purchased"
          v-model="currentItem.purchased"
          type="checkbox"
        />
        <label for="item-purchased">Purchased?</label>
        <small class="form__help">
          Once an item has been purchased, it will not be displayed in the shop
          or selected for the gachapon machine.
        </small>
      </div>
      <div class="form__group">
        <input
          id="item-gachapon"
          v-model="currentItem.gachapon"
          type="checkbox"
        />
        <label for="item-gachapon">Add to gachapon machine?</label>
        <small class="form__help">
          Items added to the gachapon machine will not be displayed in the shop.
        </small>
      </div>
      <div class="form__group">
        <label for="item-source">Source</label>
        <input id="item-source" v-model="currentItem.source" type="url" />
        <small class="form__help">
          The original URL for this item, if available. Links to D&D Beyond will
          be marked as "official," and all others will be marked as "homebrew."
        </small>
      </div>
      <div class="form__group">
        <button type="submit">
          {{ editMode === 'add' ? 'Add Item' : 'Edit Item' }}
        </button>
        <button type="button" @click="exitEditMode">Cancel</button>
      </div>
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
