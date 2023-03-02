<script setup lang="ts">
import Header from './components/header.vue'
</script>

<template>
  <Header></Header>
  <RouterView></RouterView>
</template>

<style scoped>
header {
  width: 100vw;
}
</style>