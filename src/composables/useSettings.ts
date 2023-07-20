import { ref } from 'vue';
import { firebaseApp } from '@/utils/firebase';
import { getDatabase, ref as dbRef, set, onValue } from 'firebase/database';
import { userSession } from './useAuth';
import { type Settings } from '@/types/Settings';

export const emptySettings: Settings = {
  shopName: 'Fantasy Costco',
};

// Get a reference to the database service
const database = getDatabase(firebaseApp);

/**
 * REACTIVE REFERENCES ---------------------------------------------------------
 */

export const settings = ref(emptySettings);
export const unloadSettingsListener = ref(() => {});

/**
 * API METHODS -----------------------------------------------------------------
 * These functions talk to the third-party APIs like Firebase.
 */

/**
 * Fetch Settings
 *
 * Retrieve the settings from the database and watch for changes
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const loadSettings = async (uid: string) => {
  try {
    // create a database reference
    const settingsRef = dbRef(database, `stores/${uid}/settings`);
    // add a listener for database changes
    unloadSettingsListener.value = onValue(settingsRef, (snapshot) => {
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
 * Unload Settings
 *
 * Remove all settings from state and remove listener
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const unloadSettings = async () => {
  // remove listener
  unloadSettingsListener.value();
  // reset state
  settings.value = emptySettings;
  unloadSettingsListener.value = () => {};
};

/**
 * Save Settings
 *
 * Save the current settings to the database
 *
 * @see https://firebase.google.com/docs/database/web/read-and-write
 */
export const saveSettings = async (settings: Settings) => {
  try {
    // Check to ensure user is still logged in.
    if (userSession?.value === null) throw new Error('Please log in again');
    // create a database reference
    const settingsRef = dbRef(
      database,
      `stores/${userSession.value.uid}/settings`,
    );
    // save to database
    await set(settingsRef, settings);
  } catch (error) {
    console.error(error);
  }
};
