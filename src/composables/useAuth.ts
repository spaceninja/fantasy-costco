import { ref } from 'vue';
import { firebaseApp } from '@/lib/firebase';
import {
  GithubAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';

// Get a reference to the auth service
const auth = getAuth(firebaseApp);
const githubProvider = new GithubAuthProvider();

// Used to store the user session
export const userSession = ref<User | null>(null);

/**
 * Handle OAuth Login
 *
 * Log in a user via a third-party provider.
 *
 * @see https://firebase.google.com/docs/reference/js/auth#signinwithpopup
 */
export const handleGitHubLogin = async () => {
  console.log('HANDLE OAUTH LOGIN');
  signInWithPopup(auth, githubProvider)
    .then(() => {
      console.log('OAUTH SIGNIN SUCCESSFUL');
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
  console.log('HANDLE LOGOUT');
  signOut(auth)
    .then(() => {
      console.log('You have signed out!');
    })
    .catch((error) => {
      console.error(error);
    });
};
