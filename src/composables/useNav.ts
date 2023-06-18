import { ref } from 'vue';

/**
 * REACTIVE REFERENCES ---------------------------------------------------------
 */

export const currentPage = ref<string>('frontroom');

/**
 * HELPER METHODS --------------------------------------------------------------
 */

/**
 * Change Current Page
 *
 * Sets a new value for the current page ref.
 */
export const changeCurrentPage = (page: string) => {
  currentPage.value = page;
};
