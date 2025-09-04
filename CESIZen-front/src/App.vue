<template>  
  <component :is="user?.role?.name?.toUpperCase() === 'ADMIN' ? HeaderAdmin : Header" />
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import Header from '@/components/Header.vue'
import HeaderAdmin from '@/components/HeaderAdmin.vue'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
</script>

<style scoped>
</style>