import { createApp } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '@/utils/firebase';
import { userSession } from '@/composables/useAuth';
import { loadSettings, unloadSettings } from './composables/useSettings';
import { loadUserItems, unloadUserItems } from './composables/useItem';
import {
  loadGachaponItems,
  unloadGachaponItems,
} from './composables/useGachapon';
import {
  loadFrontRoomItems,
  unloadFrontRoomItems,
} from './composables/useFrontRoom';
import App from '@/App.vue';
import '@/assets/main.scss';

createApp(App).mount('#app');

/**
 * Keeps track of if the user is logged in or out
 * and will update userSession state accordingly.
 */
const auth = getAuth(firebaseApp);
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    userSession.value = user;
    loadSettings(user.uid);
    loadUserItems(user.uid);
    loadGachaponItems(user.uid);
    loadFrontRoomItems(user.uid);
  } else {
    // User is signed out
    userSession.value = null;
    unloadSettings();
    unloadUserItems();
    unloadGachaponItems();
    unloadFrontRoomItems();
  }
});
