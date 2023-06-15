import { ref } from 'vue';
import { firebaseApp } from '@/utils/firebase';
import {
  getDatabase,
  ref as dbRef,
  push,
  set,
  onValue,
} from 'firebase/database';
import { userSession } from './useAuth';

interface Item {
  id: string;
  name: string;
}

const emptyItem: Item = {
  id: '',
  name: '',
};

// Get a reference to the database service
const database = getDatabase(firebaseApp);

/**
 * REACTIVE REFERENCES ---------------------------------------------------------
 */

export const allItems = ref<Item[]>([]);
export const currentItem = ref(emptyItem);
export const isLoading = ref(true);
export const editMode = ref<null | string>(null);
export const unloadDbListener = ref(() => {});

/**
 * EDIT MODE METHODS -----------------------------------------------------------
 * These functions control whether the app should show the Edit Book form.
 */

/**
 * Enter "Add Book" Mode
 *
 * Passes an empty book to the Edit Book form and shows it.
 */
export const enterAddBookMode = () => {
  console.log('ENTER ADD BOOK MODE');
  currentItem.value = { ...emptyItem };
  editMode.value = 'add';
};

/**
 * Enter "Edit Book" Mode
 *
 * Passes the given book to the Edit Book form and shows it.
 *
 * @param {Object} book
 */
export const enterEditBookMode = (book: Item) => {
  console.log('ENTER EDIT BOOK MODE', book);
  currentItem.value = { ...book };
  editMode.value = 'edit';
};

/**
 * Exit Edit Mode
 *
 * Resets the Edit Book form and hides it.
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
 * Fetch Items
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
      // save the books from database (or an empty array) to app state
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
    const newBookRef = dbRef(
      database,
      `stores/${userSession.value.uid}/items/${item.id}`
    );
    // save to database
    await set(newBookRef, item);
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
 * @see https://firebase.google.com/docs/reference/js/database#set
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
