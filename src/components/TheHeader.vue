<template>
  <header class="header">
    <div class="header-content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="header__branding">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="header__branding-logo" v-html="logoSvg" />
        <div class="header__branding-name">
          {{ settings?.shopName || 'Fantasy Costco' }}
        </div>
      </div>
      <nav class="app-nav">
        <ul class="app-nav__list">
          <template v-if="userSession">
            <li class="app-nav__item">
              <button
                class="app-nav__link"
                type="button"
                :aria-current="currentPage === 'frontroom'"
                @click="changeCurrentPage('frontroom')"
              >
                Front Room
              </button>
            </li>
            <li class="app-nav__item">
              <button
                class="app-nav__link"
                type="button"
                :aria-current="currentPage === 'gachapon'"
                @click="changeCurrentPage('gachapon')"
              >
                Gachapon
              </button>
            </li>
            <li class="app-nav__item">
              <button
                class="app-nav__link"
                type="button"
                :aria-current="currentPage === 'stockroom'"
                @click="changeCurrentPage('stockroom')"
              >
                Stock Room
              </button>
            </li>
            <li class="app-nav__item">
              <button
                class="app-nav__link"
                type="button"
                :aria-current="currentPage === 'settings'"
                @click="changeCurrentPage('settings')"
              >
                Settings
              </button>
            </li>
            <li class="app-nav__item">
              <button class="app-nav__link" type="button" @click="handleLogout">
                Sign Out
              </button>
            </li>
          </template>
          <template v-else>
            <button type="button" @click="handleGitHubLogin()">
              Sign in with GitHub
            </button>
          </template>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  userSession,
  handleGitHubLogin,
  handleLogout,
} from '@/composables/useAuth';
import { currentPage, changeCurrentPage } from '@/composables/useNav';
import { settings } from '@/composables/useSettings';
import logoSvg from '@/assets/logo.svg?raw';
</script>
