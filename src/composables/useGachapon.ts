import { ref, computed } from 'vue';
import { shuffle } from '@/utils/shuffle';
import { firebaseApp } from '@/utils/firebase';
import { getDatabase, ref as dbRef, set, onValue } from 'firebase/database';
import { userSession } from './useAuth';
import { type Item } from '@/types/Item';
import { unpurchasedItems } from '@/composables/useItem';

// Get a reference to the database service
const database = getDatabase(firebaseApp);

/**
 * REACTIVE REFERENCES ---------------------------------------------------------
 */

export const isLoadingGachapon = ref(false);
export const currentGachaponIds = ref<string[]>([]);
export const currentGachaponItem = ref<Item | null>(null);
export const unloadGachaponListener = ref(() => {});

/**
 * COMPUTED REFERENCES ---------------------------------------------------------
 */

export const gachaponItems = computed(() => {
  return unpurchasedItems.value.filter((item) => item.gachapon === true);
});

export const stockedGachaponIds = computed(() => {
  return gachaponItems.value
    .filter((item) => item.stocked === true)
    .map((item) => item.id);
});

export const unstockedGachaponIds = computed(() => {
  return gachaponItems.value
    .filter((item) => item.stocked === false)
    .map((item) => item.id);
});

export const currentGachaponItems = computed(() => {
  return gachaponItems.value.filter((item) =>
    currentGachaponIds.value.includes(item.id)
  );
});

/**
 * HELPER METHODS --------------------------------------------------------------
 */

export const setCurrentGachaponItem = (item: Item) => {
  currentGachaponItem.value = item;
};

/**
 * Get Random Gachapon Items
 *
 * Stocks the gachapon machine with 20 random items, first getting any "stocked"
 * items, then filling the rest with random unpurchased gachapon items.
 */
export const getRandomGachaponItems = () => {
  const remainingSlots = 20 - stockedGachaponIds.value.length;
  const shuffledGachaponItems = shuffle(unstockedGachaponIds.value);
  currentGachaponIds.value = [
    ...shuffledGachaponItems.slice(0, remainingSlots),
    ...stockedGachaponIds.value,
  ];
};

/**
 * API METHODS -----------------------------------------------------------------
 * These functions talk to the third-party APIs like Firebase.
 */

/**
 * Fetch Gachapon Items
 *
 * Retrieve the current set of Gachapon items and watch for changes
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const loadGachaponItems = async (uid: string) => {
  try {
    isLoadingGachapon.value = true;
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
      currentGachaponIds.value = data;
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoadingGachapon.value = false;
  }
};

/**
 * Unload Gachapon Items
 *
 * Remove all Gachapon items from state and remove listener
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const unloadGachaponItems = async () => {
  // remove listener
  unloadGachaponListener.value();
  // reset state
  currentGachaponIds.value = [];
  unloadGachaponListener.value = () => {};
};

/**
 * Save Gachapon Items
 *
 * Save the current Gachapon items to the database
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const saveGachaponItems = async (items: string[]) => {
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
