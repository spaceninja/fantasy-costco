<template>
  <TheHeader />
  <AuthForm v-if="userSession === null" />
  <template v-else>Logged in, yo!</template>
  <TheFooter />
</template>

<script setup lang="ts">
import { userSession } from '@/composables/useAuth';
import TheHeader from '@/components/TheHeader/TheHeader.vue';
import AuthForm from '@/components/AuthForm/AuthForm.vue';
import TheFooter from '@/components/TheFooter/TheFooter.vue';
</script>
