import { ref } from 'vue';
import { firebaseApp } from '@/utils/firebase';
import { getDatabase, ref as dbRef, get } from 'firebase/database';
import { currentFrontRoomItems } from '@/composables/useFrontRoom';
import { settings, emptySettings } from '@/composables/useSettings';

// Get a reference to the database service
const database = getDatabase(firebaseApp);

/**
 * REACTIVE REFERENCES ---------------------------------------------------------
 */

export const storeId = ref<null | string>(null);
export const isLoadingPublic = ref(false);

/**
 * API METHODS -----------------------------------------------------------------
 * These functions talk to the third-party APIs like Firebase.
 */

/**
 * Fetch Settings
 *
 * Retrieve the settings for the specified shop
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const loadPublicSettings = async (uid: string) => {
  // Remapping from `cosmic-curiosities` to Scott's store
  if (uid === 'cosmic-curiosities') uid = 'tFvAoymzLaTMdSwSgPTBXgP8ukp1';
  try {
    // create a database reference
    const settingsRef = dbRef(database, `stores/${uid}/settings`);
    // read data from the database once
    await get(settingsRef).then((snapshot) => {
      let data = snapshot.val();
      if (data === null) data = emptySettings;
      // save the settings from database to app state
      settings.value = data;
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Fetch Front Room Items
 *
 * Retrieve all front room items for the specified shop
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const loadPublicFrontRoomItems = async (uid: string) => {
  // Remapping from `cosmic-curiosities` to Scott's store
  if (uid === 'cosmic-curiosities') uid = 'tFvAoymzLaTMdSwSgPTBXgP8ukp1';
  try {
    isLoadingPublic.value = true;
    // create a database reference
    const frontRoomRef = dbRef(database, `stores/${uid}/frontroom`);
    // read data from the database once
    await get(frontRoomRef).then((snapshot) => {
      let data = snapshot.val();
      // coerce to an array for easier local filtering & sorting
      // @see https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
      if (data === null) data = [];
      data = data.isArray ? data : Object.values(data);
      // save the items from database (or an empty array) to app state
      currentFrontRoomItems.value = data;
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoadingPublic.value = false;
  }
};
