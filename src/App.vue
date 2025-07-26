<script setup>
import TopNavigation from './components/TopNavigation.vue'
import SecondaryNavigation from './components/SecondaryNavigation.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app">
    <TopNavigation />
    <SecondaryNavigation />
    <router-view />
    <Footer />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
}
</style>
