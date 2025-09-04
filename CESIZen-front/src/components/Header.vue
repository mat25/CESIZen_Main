
<template>
  <el-header class="header-shadow header">
    <div class="logo-container">
      <router-link to="/">
        <img src="@/assets/images/small-logo.png" alt="Logo" class="logo" />
      </router-link>
    </div>

    <div class="burger-menu" @click="toggleMenu">
      <el-icon><Menu /></el-icon>
    </div>

    <transition name="fade-slide">
      <nav v-if="menuOpen" class="nav-links-mobile">
        <router-link to="/" class="nav-link" @click="closeMenu">Accueil</router-link>
        <router-link to="/ressources" class="nav-link" @click="closeMenu">Ressources</router-link>
        <router-link to="/diagnostics" class="nav-link" @click="closeMenu">Diagnostics</router-link>
        <el-button
          type="success"
          :circle="false"
          tag="router-link"
          :to="user ? '/profile' : '/login'"
          class="header-button"
          @click="closeMenu"
        >
          {{ user ? user.username : 'Compte' }}
        </el-button>
      </nav>
    </transition>

    <nav class="nav-links-desktop">
      <router-link to="/" class="nav-link">Accueil</router-link>
      <router-link to="/ressources" class="nav-link">Ressources</router-link>
      <router-link to="/diagnostics" class="nav-link">Diagnostics</router-link>
      <el-button
        type="success"
        :circle="false"
        tag="router-link"
        :to="user ? '/profile' : '/login'"
        class="header-button"
      >
        {{ user ? user.username : 'Compte' }}
      </el-button>
    </nav>
  </el-header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import userService from '@/services/userService'
import { useAuth } from '@/composables/useAuth'
import { Menu } from '@element-plus/icons-vue'

const { user, setUser, clearUser } = useAuth()
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

onMounted(async () => {
  if (user.value || !localStorage.getItem('token')) return
  try {
    const response = await userService.getMe()
    setUser(response.data)
  } catch (err) {
    clearUser()
  }
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0; 
  left: 0; 
  right: 0;
  z-index: 50;
  height: var(--height-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: #f5f7fa;
}

.header-shadow {
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  height: 80px;
  width: 70px;
}

.nav-links-desktop {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  color: black;
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--el-color-success);
}

.header-button {
  text-decoration: none;
}

.burger-menu {
  display: none;
  cursor: pointer;
}

.nav-links-mobile {
  position: absolute;
  top: var(--height-header);
  left: 0;
  right: 0;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  z-index: 49;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .nav-links-desktop {
    display: none;
  }
  .burger-menu {
    display: block;
  }
}
</style>
