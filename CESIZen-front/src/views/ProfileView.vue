<template>
  <div class="profile-container">
    <h1 class="main-title">Gestion de votre compte</h1>

    <div class="profile-logout">
      <el-button @click="handleLogout" type="danger">
      <template #icon>
        <el-icon><SwitchButton /></el-icon>
      </template>
      Se déconnecter
      </el-button>
    </div>

    <div class="forms-wrapper">
      <!-- Formulaire modif infos perso -->
      <el-card class="profile-card" shadow="always">
        <h2 class="profile-title section-label">Modifier vos informations personnelles</h2>
        <el-form @submit.prevent="handleUpdateInfo" :model="infoForm" label-position="top">
          <el-input
            v-model="infoForm.username"
            placeholder="Pseudo"
            clearable
            :disabled="infoLoading"
            class="form-input"
          />
          <el-input
            v-model="infoForm.email"
            placeholder="Email"
            clearable
            :disabled="infoLoading"
            class="form-input"
          />
          <el-form-item>
            <el-button
              type="success"
              native-type="submit"
              :loading="infoLoading"
              :disabled="infoLoading"
              class="profile-button"
            >
              <template #icon>
                <el-icon><Edit /></el-icon>
              </template>
              Modifier
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- Formulaire modif mot de passe -->
      <el-card class="profile-card" shadow="always">
        <h2 class="profile-title section-label">Modifier votre mot de passe</h2>
        <el-form @submit.prevent="handleUpdatePassword" :model="passwordForm" label-position="top">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="Ancien mot de passe"
            clearable
            show-password
            :disabled="passwordLoading"
            class="form-input"
          />
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="Nouveau mot de passe"
            clearable
            show-password
            :disabled="passwordLoading"
            class="form-input"
          />
          <el-input
            v-model="passwordForm.newPasswordConfirm"
            type="password"
            show-password
            placeholder="Confirmation nouveau mot de passe"
            clearable
            :disabled="passwordLoading"
            class="form-input"
          />
          <el-form-item>
            <el-button
              type="success"
              native-type="submit"
              :loading="passwordLoading"
              :disabled="passwordLoading"
              class="profile-button"
            >
              <template #icon>
                <el-icon><Edit /></el-icon>
              </template>
              Modifier
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-alert
      v-if="message"
      :title="message"
      :type="messageType"
      show-icon
      class="profile-alert"
      @close="message = null"
      closable
    />
  </div>

  <div class="rgpd-container">
    <h1 class="main-title">RGPD</h1>
    <div class="rgpd-wrapper">
        <el-button @click="handleAccessData" type="success">
          <template #icon>
            <el-icon><Document /></el-icon>
          </template>
          Droit d’accès
        </el-button>
        <el-button @click="handleDeleteData"  type="danger">
          <template #icon>
            <el-icon><Delete /></el-icon>
          </template>
          Droit d’effacement
        </el-button>
    </div>
  </div>

  <div class="delete-container">
    <h1 class="main-title">Suppression de votre compte</h1>
    <div class="delete-wrapper">
        <el-button @click="handleDeleteAccount" type="danger">
          <template #icon>
            <el-icon><DeleteFilled /></el-icon>
          </template>
          Supprimer
        </el-button>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import userService from '../services/userService'
import { useAuth } from '../composables/useAuth'
import { Edit, Delete, DeleteFilled, Document, SwitchButton } from '@element-plus/icons-vue'

const { user, setUser } = useAuth()

const infoForm = ref({ username: '', email: '' })
const infoLoading = ref(false)
const passwordLoading = ref(false)
const passwordForm = ref({ oldPassword: '', newPassword: '', newPasswordConfirm: '' })

const message = ref(null)
const messageType = ref('success')

onMounted(() => {
  if (user.value) {
    infoForm.value.username = user.value.username
    infoForm.value.email = user.value.email
  }
})

function handleLogout() {
  userService.logout()
}

const handleUpdateInfo = async () => {
  infoLoading.value = true
  message.value = null
  try {
    const response = await userService.updateProfile({
      username: infoForm.value.username,
      email: infoForm.value.email
    })
    setUser(response.data)
    message.value = "Informations personnelles mises à jour avec succès."
    messageType.value = "success"
  } catch (err) {
    message.value = err.response?.data?.message || "Erreur lors de la mise à jour."
    messageType.value = "error"
  } finally {
    infoLoading.value = false
  }
}

const handleUpdatePassword = async () => {
  message.value = null

  if (passwordForm.value.newPassword !== passwordForm.value.newPasswordConfirm) {
    message.value = "Le nouveau mot de passe et sa confirmation ne correspondent pas."
    messageType.value = "error"
    return
  }

  passwordLoading.value = true
  try {
    await userService.updatePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    message.value = "Mot de passe modifié avec succès."
    messageType.value = "success"

    passwordForm.value.oldPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.newPasswordConfirm = ''
  } catch (err) {
    const response = err.response?.data
    if (response?.errors && Array.isArray(response.errors)) {
      message.value = response.errors.join(', ')
    } else {
      message.value = response?.message || "Erreur lors de la modification du mot de passe."
    }
    messageType.value = "error"
  } finally {
    passwordLoading.value = false
  }
}

const handleDeleteAccount = async () => {
  try {
    await userService.deleteAccount()
    userService.logout()
  } catch (err) {
    message.value = err.response?.data?.message || "Erreur lors de la suppression du compte."
    messageType.value = "error"
  }
}

const handleAccessData = async () => {
  try {
    const response = await userService.getPersonalData()
    const json = JSON.stringify(response.data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'mes_donnees.json'
    link.click()
    message.value = "Vos données personnelles ont été téléchargées."
    messageType.value = "success"
  } catch (err) {
    message.value = err.response?.data?.message || "Erreur lors de la récupération des données."
    messageType.value = "error"
  }
}

const handleDeleteData = async () => {
  try {
    await userService.deletePersonalData()
    userService.logout()
  } catch (err) {
    message.value = err.response?.data?.message || "Erreur lors de la suppression des données."
    messageType.value = "error"
  }
}

</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 10px auto;
  padding: 20px;
}

.forms-wrapper {
  display: flex;
  gap: 40px;
  flex-wrap: wrap; 
  justify-content: center;
}

.profile-card {
  flex: 1 1 400px; 
  min-width: 320px;
  padding: 30px;
  box-sizing: border-box;
}

.profile-title {
  text-align: center;
  margin-bottom: 20px;
}

.profile-button {
  width: 100%;
}

.profile-alert {
  max-width: 600px;
  margin: 0 auto 40px;
}

.rgpd-wrapper {
  display: flex;
  gap: 40px;
  flex-wrap: wrap; 
  justify-content: center;
}

.delete-container {
    margin-top: 30px;
}

.delete-wrapper {
    display: flex;
    justify-content: center;
}
.profile-logout {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}


</style>
