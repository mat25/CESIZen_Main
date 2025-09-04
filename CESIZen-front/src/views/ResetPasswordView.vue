<template>
  <h1 class="main-title">Réinitialiser le mot de passe</h1>
  <el-container class="auth-container">
    <el-card class="auth-card" shadow="always">
      <h2 class="section-label">Réinitialisation de votre mot de passe</h2>
      <p class="input-label">
        Veuillez saisir un nouveau mot de passe pour accéder à votre compte.
      </p>
      <el-form @submit.prevent="handleReset" :model="{ newPassword, confirmPassword }" label-position="top">
        <el-input
          v-model="newPassword"
          placeholder="Nouveau mot de passe"
          show-password
          clearable
          :disabled="loading"
          class="form-input"
        />
        <el-input
          v-model="confirmPassword"
          placeholder="Confirmation du mot de passe"
          show-password
          clearable
          :disabled="loading"
          class="form-input"
        />
        <small class="small-text">
          Votre mot de passe de 8 caractères minimum, doit contenir au moins un chiffre, une minuscule, une majuscule et un caractère spécial (#@$!%*?&).
        </small>
        <el-alert
          v-if="Array.isArray(error)"
          type="error"
          show-icon
          class="auth-error"
        >
          <ul>
            <li v-for="(msg, index) in error" :key="index">{{ msg }}</li>
          </ul>
        </el-alert>
        <el-alert
          v-else-if="error"
          :title="error"
          type="error"
          show-icon
          class="auth-error"
        />
        <el-alert
          v-if="message"
          :title="message"
          type="success"
          show-icon
          class="auth-error"
        />
        <el-form-item class="center-button">
          <el-button type="success" native-type="submit" :loading="loading" class="auth-button">
            Réinitialiser
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import userService from '@/services/userService'

const route = useRoute()
const router = useRouter()
const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const message = ref(null)
const error = ref(null)

onMounted(() => {
  token.value = route.query.token || ''
})

const handleReset = async () => {
  error.value = null
  message.value = null

  if (!newPassword.value || !confirmPassword.value) {
    error.value = "Veuillez remplir les deux champs de mot de passe."
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = "Les mots de passe ne correspondent pas."
    return
  }

  loading.value = true
  try {
    await userService.confirmPasswordReset(token.value, newPassword.value)
    message.value = "Mot de passe réinitialisé avec succès. Redirection..."
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    const response = err.response?.data
    if (response?.errors && Array.isArray(response.errors)) {
      error.value = response.errors
    } else {
      error.value = "Erreur lors de la réinitialisation."
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.auth-card {
  width: 400px;
  padding: 30px;
  text-align: center;
}

.auth-button {
  width: 100%;
}

.auth-error {
  margin-top: 20px;
}

.auth-error ul {
  margin: 0;
  padding-left: 1.2em;
}

.auth-error li {
  margin: 5px 0;
}

.input-label {
  text-align: left;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.small-text {
  display: block;
  text-align: left;
  font-size: 12px;
  color: #888;
  margin-top: -10px;
  margin-bottom: 16px;
}

.center-button {
  display: flex;
  justify-content: center;
}
</style>
