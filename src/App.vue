<script setup>
import { ref } from 'vue'
import TopNavigation from './components/TopNavigation.vue'
import SecondaryNavigation from './components/SecondaryNavigation.vue'
import MainContent from './components/MainContent.vue'
import Footer from './components/Footer.vue'

const mainContentRef = ref(null)

const handleNavigation = (page) => {
  if (mainContentRef.value) {
    mainContentRef.value.navigateTo(page)
  }
}
</script>

<template>
  <div class="app">
    <TopNavigation />
    <SecondaryNavigation @navigate="handleNavigation" />
    <MainContent ref="mainContentRef" />
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
