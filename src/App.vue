<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from "./components/AppFooter.vue";
import { RouterLink } from 'vue-router';

export default {
  name: 'App',

  components: {
    AppHeader,
    AppFooter,
  }

}


</script>

<template>

  <AppHeader />

  <router-view />

  <AppFooter />


</template>

<style scoped></style>
