import { ref, computed } from 'vue';
import { shuffle } from '@/utils/shuffle';
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
export const currentGachaponItems = ref<Item[]>([]);
export const currentFrontRoomItems = ref<Item[]>([]);
export const currentItem = ref(emptyItem);
export const isLoading = ref(true);
export const editMode = ref<null | string>(null);
export const unloadDbListener = ref(() => {});
export const unloadGachaponListener = ref(() => {});
export const unloadFrontRoomListener = ref(() => {});

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

// Gachapon items

export const gachaponItems = computed(() => {
  return unpurchasedItems.value.filter((item) => item.gachapon === true);
});

export const stockedGachaponItems = computed(() => {
  return gachaponItems.value.filter((item) => item.stocked === true);
});

export const unstockedGachaponItems = computed(() => {
  return gachaponItems.value.filter((item) => item.stocked === false);
});

// Front Room items

export const frontRoomItems = computed(() => {
  return unpurchasedItems.value.filter((item) => item.gachapon === false);
});

export const stockedFrontRoomItems = computed(() => {
  return frontRoomItems.value.filter((item) => item.stocked === true);
});

export const unstockedFrontRoomItems = computed(() => {
  return frontRoomItems.value.filter((item) => item.stocked === false);
});

/**
 * HELPER METHODS --------------------------------------------------------------
 */

/**
 * Get Random Gachapon Items
 *
 * Stocks the gachapon machine with 20 random items, first getting any "stocked"
 * items, then filling the rest with random unpurchased gachapon items.
 */
export const getRandomGachaponItems = () => {
  const remainingSlots = 20 - stockedGachaponItems.value.length;
  const shuffledGachaponItems = shuffle(unstockedGachaponItems.value);
  currentGachaponItems.value = [
    ...shuffledGachaponItems.slice(0, remainingSlots),
    ...stockedGachaponItems.value,
  ];
};

/**
 * Get Random Front Room Items By Rarity
 *
 * Stocks the front room with a number of random items, first getting any "stocked"
 * items, then filling the rest with unpurchased items of the given rarity.
 */
export const getRandomFrontRoomItemsByRarity = (
  rarity: string,
  count: number
) => {
  const stocked = stockedFrontRoomItems.value.filter((item) => {
    console.log(rarity, item.rarity, item.rarity === rarity);
    return item.rarity === rarity;
  });
  const unstocked = unstockedFrontRoomItems.value.filter(
    (item) => item.rarity === rarity
  );
  const remainingSlots = count - stocked.length;
  const shuffled = shuffle(unstocked);
  return [...shuffled.slice(0, remainingSlots), ...stocked].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

/**
 * Get Random Front Room Items
 *
 * Stocks the front room with random items, first getting any "stocked"
 * items, then filling the rest with random unpurchased front room items.
 */
export const getRandomFrontRoomItems = () => {
  const common = getRandomFrontRoomItemsByRarity('common', 6) as Item[];
  const uncommon = getRandomFrontRoomItemsByRarity('uncommon', 6) as Item[];
  const rare = getRandomFrontRoomItemsByRarity('rare', 4) as Item[];
  const veryRare = getRandomFrontRoomItemsByRarity('very-rare', 2) as Item[];
  const legendary = getRandomFrontRoomItemsByRarity('legendary', 1) as Item[];
  currentFrontRoomItems.value = [
    ...common,
    ...uncommon,
    ...rare,
    ...veryRare,
    ...legendary,
  ];
};

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
  console.log('ENTER ADD ITEM MODE');
  currentItem.value = { ...emptyItem };
  editMode.value = 'add';
};

/**
 * Enter "Edit Item" Mode
 *
 * Passes the given item to the Edit Item form and shows it.
 */
export const enterEditItemMode = (item: Item) => {
  console.log('ENTER EDIT ITEM MODE', item);
  currentItem.value = { ...item };
  editMode.value = 'edit';
};

/**
 * Exit Edit Mode
 *
 * Resets the Edit Item form and hides it.
 */
export const exitEditMode = () => {
  console.log('EXIT EDIT MODE');
  currentItem.value = { ...emptyItem };
  editMode.value = null;
};

/**
 * API METHODS -----------------------------------------------------------------
 * These functions talk to the third-party APIs like Firebase.
 */

/**
 * Fetch All Items
 *
 * Retreive all items for the signed in user and watch for changes
 *
 * @see https://firebase.google.com/docs/reference/js/database#onvalue
 */
export const loadUserItems = async (uid: string) => {
  console.log('FETCH ITEMS', uid);
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
      console.log('ITEMS REF CHANGE', allItems.value);
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
 * @see https://firebase.google.com/docs/reference/js/database#onvalue
 */
export const unloadUserItems = async () => {
  console.log('UNLOAD ITEMS');
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
  console.log('ADD ITEM', item);
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
 * @see https://firebase.google.com/docs/reference/js/database#set
 */
export const editItem = async (item: Item) => {
  console.log('EDIT ITEM', item);
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
 */
export const deleteItem = async (deletedItemId: string) => {
  console.log('DELETE ITEM', deletedItemId);
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

/**
 * Fetch Gachapon Items
 *
 * Retreive the current set of Gachapon items and watch for changes
 */
export const loadGachaponItems = async (uid: string) => {
  console.log('FETCH GACHAPON ITEMS', uid);
  try {
    isLoading.value = true;
    // create a database reference
    const itemListRef = dbRef(database, `stores/${uid}/gachapon`);
    // add a listener for database changes
    unloadGachaponListener.value = onValue(itemListRef, (snapshot) => {
      let data = snapshot.val();
      // coerce to an array for easier local filtering & sorting
      // @see https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
      if (data === null) data = [];
      data = data.isArray ? data : Object.values(data);
      // save the items from database (or an empty array) to app state
      currentGachaponItems.value = data;
      console.log('GACHAPON ITEMS REF CHANGE', currentGachaponItems.value);
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Unload Gachapon Items
 *
 * Remove all Gachapon items from state and remove listener
 */
export const unloadGachaponItems = async () => {
  console.log('UNLOAD ITEMS');
  // remove listener
  unloadGachaponListener.value();
  // reset state
  allItems.value = [];
  unloadGachaponListener.value = () => {};
};

/**
 * Save Gachapon Items
 *
 * Save the current Gachapon items to the database
 */
export const saveGachaponItems = async (items: Item[]) => {
  console.log('SAVE GACHAPON ITEMS', items);
  try {
    // Check to ensure user is still logged in.
    if (userSession?.value === null) throw new Error('Please log in again');
    // create a database reference
    const gachaponRef = dbRef(
      database,
      `stores/${userSession.value.uid}/gachapon`
    );
    // save to database
    await set(gachaponRef, items);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Fetch Front Room Items
 *
 * Retreive the current set of Front Room items and watch for changes
 */
export const loadFrontRoomItems = async (uid: string) => {
  console.log('FETCH FRONT ROOM ITEMS', uid);
  try {
    isLoading.value = true;
    // create a database reference
    const itemListRef = dbRef(database, `stores/${uid}/frontroom`);
    // add a listener for database changes
    unloadFrontRoomListener.value = onValue(itemListRef, (snapshot) => {
      let data = snapshot.val();
      // coerce to an array for easier local filtering & sorting
      // @see https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
      if (data === null) data = [];
      data = data.isArray ? data : Object.values(data);
      // save the items from database (or an empty array) to app state
      currentFrontRoomItems.value = data;
      console.log('FRONT ROOM ITEMS REF CHANGE', currentFrontRoomItems.value);
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Unload Front Room Items
 *
 * Remove all Front Room items from state and remove listener
 */
export const unloadFrontRoomItems = async () => {
  console.log('UNLOAD ITEMS');
  // remove listener
  unloadFrontRoomListener.value();
  // reset state
  allItems.value = [];
  unloadFrontRoomListener.value = () => {};
};

/**
 * Save Front Room Items
 *
 * Save the current Front Room items to the database
 */
export const saveFrontRoomItems = async (items: Item[]) => {
  console.log('SAVE FRONT ROOM ITEMS', items);
  try {
    // Check to ensure user is still logged in.
    if (userSession?.value === null) throw new Error('Please log in again');
    // create a database reference
    const frontRoomRef = dbRef(
      database,
      `stores/${userSession.value.uid}/frontroom`
    );
    // save to database
    await set(frontRoomRef, items);
  } catch (error) {
    console.error(error);
  }
};
