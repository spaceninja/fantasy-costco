<template>
  <TheHeader />
  <AuthForm v-if="userSession === null" />
  <TheShop v-else />
  <TheFooter />
</template>

<script setup lang="ts">
import { userSession } from '@/composables/useAuth';
import TheHeader from '@/components/TheHeader/TheHeader.vue';
import AuthForm from '@/components/AuthForm/AuthForm.vue';
import TheShop from '@/components/TheShop/TheShop.vue';
import TheFooter from '@/components/TheFooter/TheFooter.vue';
</script>
