import { ref } from 'vue';
import { firebaseApp } from '@/utils/firebase';
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
 * Handle GitHub Login
 *
 * Log in a user via GitHub
 *
 * @see https://firebase.google.com/docs/reference/js/auth#signinwithpopup
 */
export const handleGitHubLogin = async () => {
  console.log('HANDLE GITHUB LOGIN');
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
  console.log('HANDLE LOGOUT');
  signOut(auth)
    .then(() => {
      console.info('You have signed out!');
    })
    .catch((error) => {
      console.error(error);
    });
};
