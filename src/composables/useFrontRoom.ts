import { ref, computed } from 'vue';
import { shuffle } from '@/utils/shuffle';
import { firebaseApp } from '@/utils/firebase';
import { getDatabase, ref as dbRef, set, onValue } from 'firebase/database';
import { userSession } from './useAuth';
import { type Item } from '@/types/Item';
import { allItems, unpurchasedItems } from '@/composables/useItem';

// Get a reference to the database service
const database = getDatabase(firebaseApp);

/**
 * REACTIVE REFERENCES ---------------------------------------------------------
 */

export const isLoadingFrontRoom = ref(false);
export const currentFrontRoomIds = ref<string[]>([]);
export const unloadFrontRoomListener = ref(() => {});

/**
 * COMPUTED REFERENCES ---------------------------------------------------------
 */

export const allFrontRoomItems = computed(() => {
  return allItems.value.filter((item) => item.gachapon === false);
});

export const frontRoomItems = computed(() => {
  return unpurchasedItems.value.filter((item) => item.gachapon === false);
});

export const stockedFrontRoomItems = computed(() => {
  return frontRoomItems.value.filter((item) => item.stocked === true);
});

export const unstockedFrontRoomItems = computed(() => {
  return frontRoomItems.value.filter((item) => item.stocked === false);
});

export const currentFrontRoomItems = computed(() => {
  return allFrontRoomItems.value.filter((item) =>
    currentFrontRoomIds.value.includes(item.id),
  );
});

/**
 * HELPER METHODS --------------------------------------------------------------
 */

/**
 * Get Random Front Room Items By Rarity
 *
 * Stocks the front room with a number of random items, first getting any "stocked"
 * items, then filling the rest with unpurchased items of the given rarity.
 */
export const getRandomFrontRoomItemsByRarity = (
  rarity: string,
  count: number,
) => {
  const stocked = stockedFrontRoomItems.value.filter(
    (item) => item.rarity === rarity,
  );
  const unstocked = unstockedFrontRoomItems.value.filter(
    (item) => item.rarity === rarity,
  );
  const remainingSlots = count - stocked.length;
  const shuffled = shuffle(unstocked);
  return [...shuffled.slice(0, remainingSlots), ...stocked]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item: Item) => item.id);
};

/**
 * Get Random Front Room Items
 *
 * Stocks the front room with random items, first getting any "stocked"
 * items, then filling the rest with random unpurchased front room items.
 */
export const getRandomFrontRoomItems = () => {
  const common = getRandomFrontRoomItemsByRarity('common', 6);
  const uncommon = getRandomFrontRoomItemsByRarity('uncommon', 6);
  const rare = getRandomFrontRoomItemsByRarity('rare', 4);
  const veryRare = getRandomFrontRoomItemsByRarity('very-rare', 2);
  const legendary = getRandomFrontRoomItemsByRarity('legendary', 1);
  currentFrontRoomIds.value = [
    ...common,
    ...uncommon,
    ...rare,
    ...veryRare,
    ...legendary,
  ];
};

/**
 * API METHODS -----------------------------------------------------------------
 * These functions talk to the third-party APIs like Firebase.
 */

/**
 * Fetch Front Room Items
 *
 * Retrieve the current set of Front Room items and watch for changes
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const loadFrontRoomItems = async (uid: string) => {
  try {
    isLoadingFrontRoom.value = true;
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
      currentFrontRoomIds.value = data;
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoadingFrontRoom.value = false;
  }
};

/**
 * Unload Front Room Items
 *
 * Remove all Front Room items from state and remove listener
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const unloadFrontRoomItems = async () => {
  // remove listener
  unloadFrontRoomListener.value();
  // reset state
  currentFrontRoomIds.value = [];
  unloadFrontRoomListener.value = () => {};
};

/**
 * Save Front Room Items
 *
 * Save the current Front Room items to the database
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const saveFrontRoomItems = async (items: string[]) => {
  try {
    // Check to ensure user is still logged in.
    if (userSession?.value === null) throw new Error('Please log in again');
    // create a database reference
    const frontRoomRef = dbRef(
      database,
      `stores/${userSession.value.uid}/frontroom`,
    );
    // save to database
    await set(frontRoomRef, items);
  } catch (error) {
    console.error(error);
  }
};
