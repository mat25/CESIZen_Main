<template>
  <h1 class="main-title">Mot de passe oublié</h1>
  <el-container class="auth-container">
    <el-card class="auth-card" shadow="always">
      <h2 class="section-label">Vous avez perdu votre mot de passe ?</h2>
      <p class="input-label">
        Pour réinitialiser votre mot de passe, merci d'indiquer votre email avec lequel vous vous êtes enregistré.
      </p>
      <el-form @submit.prevent="handleRequest" :model="{ email }" label-position="top">
        <el-input
          v-model="email"
          placeholder="Adresse e-mail"
          clearable
          :disabled="loading"
          class="form-input"
        />
        <el-alert v-if="message" :title="message" type="success" show-icon class="auth-error" />
        <el-alert v-if="error" :title="error" type="error" show-icon class="auth-error" />
        <el-form-item class="center-button">
          <el-button type="success" native-type="submit" :loading="loading" class="auth-button">
            Envoyer le lien
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import userService from '@/services/userService'

const email = ref('')
const loading = ref(false)
const message = ref(null)
const error = ref(null)

const handleRequest = async () => {
  error.value = null
  message.value = null
  if (!email.value) {
    error.value = "Veuillez entrer votre adresse e-mail."
    return
  }
  loading.value = true
  try {
    await userService.requestPasswordReset(email.value)
    message.value = "Un lien de réinitialisation a été envoyé à votre adresse e-mail."
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de l'envoi du lien."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
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

.input-label {
  text-align: left;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.center-button {
  display: flex;
  justify-content: center;
}
</style>
