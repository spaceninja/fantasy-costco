import { ref } from 'vue';

export const currentPage = ref<string>('frontroom');

export const changeCurrentPage = (page: string) => {
  console.log('NAVIGATE TO', page);
  currentPage.value = page;
};
