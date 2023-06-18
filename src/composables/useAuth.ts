import { ref } from 'vue';
import { firebaseApp } from '@/utils/firebase';
import {
  GithubAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';

// Get a reference to the auth service and github provider
const auth = getAuth(firebaseApp);
const githubProvider = new GithubAuthProvider();

/**
 * REACTIVE REFERENCES ---------------------------------------------------------
 */

// Used to store the user session
export const userSession = ref<User | null>(null);

/**
 * API METHODS -----------------------------------------------------------------
 * These functions talk to the third-party APIs like Firebase.
 */

/**
 * Handle GitHub Login
 *
 * Log in a user via GitHub
 *
 * @see https://firebase.google.com/docs/auth/web/github-auth
 */
export const handleGitHubLogin = async () => {
  signInWithPopup(auth, githubProvider)
    .then(() => {
      console.info('GitHub signin successful!');
    })
    .catch((error) => {
      console.error(error);
    });
};

/**
 * Handle Logout
 *
 * Log the current user out.
 *
 * @see https://firebase.google.com/docs/reference/js/auth#signout
 */
export const handleLogout = async () => {
  signOut(auth)
    .then(() => {
      console.info('You have signed out!');
    })
    .catch((error) => {
      console.error(error);
    });
};
