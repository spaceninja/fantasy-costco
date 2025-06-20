import globals from 'globals';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs(
  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  eslintConfigPrettier,
  {
    ignores: ['dist/**/*'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2023,
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
    },
  },
  {
    // HACK: https://github.com/vuejs/eslint-plugin-vue/issues/1355
    files: ['**/*.html'],
    rules: { 'vue/comment-directive': 'off' },
  },
);
