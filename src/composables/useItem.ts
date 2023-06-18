import { ref, computed } from 'vue';
import { firebaseApp } from '@/utils/firebase';
import {
  getDatabase,
  ref as dbRef,
  push,
  set,
  onValue,
} from 'firebase/database';
import { userSession } from './useAuth';
import { type Item } from '@/types/Item';
import { capitalize } from '@/utils/capitalize';

const emptyItem: Item = {
  id: '',
  name: '',
  category: '',
  categoryNotes: '',
  rarity: '',
  description: '',
  source: '',
  restrictions: '',
  attunement: false,
  stocked: false,
  purchased: false,
  gachapon: false,
};

// Get a reference to the database service
const database = getDatabase(firebaseApp);

/**
 * REACTIVE REFERENCES ---------------------------------------------------------
 */

export const allItems = ref<Item[]>([]);
export const currentItem = ref<Item>(emptyItem);
export const isLoading = ref(false);
export const editMode = ref<null | string>(null);
export const unloadDbListener = ref(() => {});

/**
 * COMPUTED REFERENCES ---------------------------------------------------------
 */

export const purchasedItems = computed(() => {
  return allItems.value.filter((item) => item.purchased === true);
});

export const unpurchasedItems = computed(() => {
  return allItems.value.filter((item) => item.purchased === false);
});

// Unpurchased by rarity

export const commonItems = computed(() => {
  return unpurchasedItems.value.filter((item) => item.rarity === 'common');
});

export const uncommonItems = computed(() => {
  return unpurchasedItems.value.filter((item) => item.rarity === 'uncommon');
});

export const rareItems = computed(() => {
  return unpurchasedItems.value.filter((item) => item.rarity === 'rare');
});

export const veryRareItems = computed(() => {
  return unpurchasedItems.value.filter((item) => item.rarity === 'very-rare');
});

export const legendaryItems = computed(() => {
  return unpurchasedItems.value.filter((item) => item.rarity === 'legendary');
});

/**
 * EDIT MODE METHODS -----------------------------------------------------------
 * These functions control whether the app should show the Edit Item form.
 */

/**
 * Enter "Add Item" Mode
 *
 * Passes an empty item to the Edit Item form and shows it.
 */
export const enterAddItemMode = () => {
  currentItem.value = { ...emptyItem };
  editMode.value = 'add';
};

/**
 * Enter "Edit Item" Mode
 *
 * Passes the given item to the Edit Item form and shows it.
 */
export const enterEditItemMode = (item: Item) => {
  currentItem.value = { ...item };
  editMode.value = 'edit';
};

/**
 * Exit Edit Mode
 *
 * Resets the Edit Item form and hides it.
 */
export const exitEditMode = () => {
  currentItem.value = { ...emptyItem };
  editMode.value = null;
};

/**
 * HELPER METHODS --------------------------------------------------------------
 */

/**
 * Friendly Rarity
 *
 * Returns a human-friendly version of a rarity value.
 */
export const friendlyRarity = (rarity: string) => {
  if (rarity === 'very-rare') return 'very rare';
  return rarity;
};

/**
 * Friendly Category
 *
 * Returns a human-friendly version of a category value.
 */
export const friendlyCategory = (category: string) => {
  if (category === 'wonderous') return 'Wonderous item';
  return capitalize(category);
};

/**
 * Get Price By Rarity
 *
 * Returns a price based on the given rarity.
 */
export const getPriceByRarity = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return '50';
    case 'uncommon':
      return '250';
    case 'rare':
      return '3,000';
    case 'very-rare':
      return '40,000';
    case 'legendary':
      return '200,000';
    default:
      return 0;
  }
};

/**
 * API METHODS -----------------------------------------------------------------
 * These functions talk to the third-party APIs like Firebase.
 */

/**
 * Fetch All Items
 *
 * Retrieve all items for the signed in user and watch for changes
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const loadUserItems = async (uid: string) => {
  try {
    isLoading.value = true;
    // create a database reference
    const itemListRef = dbRef(database, `stores/${uid}/items`);
    // add a listener for database changes
    unloadDbListener.value = onValue(itemListRef, (snapshot) => {
      let data = snapshot.val();
      // coerce to an array for easier local filtering & sorting
      // @see https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
      if (data === null) data = [];
      data = data.isArray ? data : Object.values(data);
      // save the items from database (or an empty array) to app state
      allItems.value = data;
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Unload Items
 *
 * Remove all items from state and remove listener
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const unloadUserItems = async () => {
  // remove listener
  unloadDbListener.value();
  // reset state
  allItems.value = [];
  unloadDbListener.value = () => {};
};

/**
 * Add Item
 *
 * Add a new item to database
 *
 * @see https://firebase.google.com/docs/reference/js/database#push
 */
export const addItem = async (item: Item) => {
  try {
    // Check to ensure user is still logged in.
    if (userSession?.value === null) throw new Error('Please log in again');
    // create a database reference
    const itemListRef = dbRef(
      database,
      `stores/${userSession.value.uid}/items`
    );
    // push a new item to the database
    const newItemRef = push(itemListRef);
    // save the new database key as the item's ID
    item.id = newItemRef.key || '';
    // save the item to database
    await set(newItemRef, item);
    exitEditMode();
  } catch (error) {
    console.error(error);
  }
};

/**
 * Edit Item
 *
 * Targets a specific item via its id and updates it.
 *
 * @see https://firebase.google.com/docs/database/web/lists-of-data
 */
export const editItem = async (item: Item) => {
  try {
    // Check to ensure user is still logged in.
    if (userSession?.value === null) throw new Error('Please log in again');
    // create a database reference
    const newItemRef = dbRef(
      database,
      `stores/${userSession.value.uid}/items/${item.id}`
    );
    // save to database
    await set(newItemRef, item);
    exitEditMode();
  } catch (error) {
    console.error(error);
  }
};

/**
 * Delete Item
 *
 * Deletes an item via its id
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const deleteItem = async (deletedItemId: string) => {
  try {
    // Check to ensure user is still logged in.
    if (userSession?.value === null) throw new Error('Please log in again');
    // create a database reference
    const itemRef = dbRef(
      database,
      `stores/${userSession.value.uid}/items/${deletedItemId}`
    );
    // save to database
    await set(itemRef, null);
  } catch (error) {
    console.error(error);
  }
};
