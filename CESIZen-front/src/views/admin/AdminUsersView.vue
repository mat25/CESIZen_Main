<template>
  <!-- Modal -->
  <el-dialog v-model="showModal" :title="modalTitle" width="500px">
    <el-form @submit.prevent="submitForm" :model="form" label-position="top">
      <el-input v-model="form.username" placeholder="Pseudo" clearable class="auth-input form-input" />
      <el-input v-model="form.email" placeholder="E-mail" clearable class="auth-input form-input" />
      <el-input v-model="form.emailConfirm" placeholder="Confirmation e-mail" clearable class="auth-input form-input" />
      <el-input v-model="form.password" placeholder="Mot de passe" show-password clearable class="auth-input form-input" />
      <small class="password-help small-text">
        Votre mot de passe de 8 caractères minimum, doit contenir au moins un chiffre, une minuscule, une majuscule et un caractère spécial (#@$!%*?&).
      </small>
      <el-input v-model="form.passwordConfirm" placeholder="Confirmation mot de passe" show-password clearable class="auth-input form-input" />
      <el-alert v-if="formErrors.length" type="error" show-icon class="auth-error">
        <ul>
          <li v-for="(msg, index) in formErrors" :key="index">{{ msg }}</li>
        </ul>
      </el-alert>
    </el-form>
    <template #footer>
      <el-button @click="showModal = false">Annuler</el-button>
      <el-button type="primary" @click="submitForm" :loading="formLoading">Créer</el-button>
    </template>
  </el-dialog>

  <div class="admin-users-container">
    <h1 class="main-title">Gestion des comptes</h1>

    <div class="section-label">Créer un compte</div>
    <div class="create-buttons">
      <el-button type="primary" @click="openModal('USER')">Créer un compte utilisateur</el-button>
      <el-button type="warning" @click="openModal('ADMIN')">Créer un compte administrateur</el-button>
    </div>

    <div class="section-label">Liste des comptes utilisateur</div>
    <el-table :data="paginatedUsers" style="width: 100%" class="user-table">
      <el-table-column
        prop="username"
        label="Pseudo"
        sortable
        :filters="generateFilters('username')"
        :filter-method="filterHandler"
        filter-placement="bottom-end"
      />
      <el-table-column
        prop="email"
        label="E-mail"
        sortable
        :filters="generateFilters('email')"
        :filter-method="filterHandler"
        filter-placement="bottom-end"
      />
      <el-table-column
        label="Gestion"
        align="center"
        sortable
        :sort-method="(a, b) => a.status.localeCompare(b.status)"
      >
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button
              :type="row.status === 'ACTIVE' ? 'warning' : 'success'"
              size="small"
              class="action-button"
              @click="toggleStatus(row)"
            >
              {{ row.status === 'ACTIVE' ? 'Désactiver' : 'Activer' }}
            </el-button>
            <el-button
              type="danger"
              size="small"
              class="action-button"
              @click="deleteUser(row.id)"
            >
              Supprimer
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="users.length > pageSize"
      background
      layout="prev, pager, next"
      :total="users.length"
      :page-size="pageSize"
      @current-change="currentPage = $event"
      class="table-pagination"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import userService from '@/services/userService'
import { ElMessage, ElMessageBox } from 'element-plus'

const users = ref([])
const pageSize = 20
const currentPage = ref(1)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return users.value.slice(start, start + pageSize)
})

const showModal = ref(false)
const modalTitle = ref('')
const form = ref({
  username: '',
  email: '',
  emailConfirm: '',
  password: '',
  passwordConfirm: '',
  role: ''
})
const formErrors = ref([])
const formLoading = ref(false)

const openModal = (role) => {
  form.value = {
    username: '',
    email: '',
    emailConfirm: '',
    password: '',
    passwordConfirm: '',
    role
  }
  modalTitle.value = `Créer un compte ${role === 'ADMIN' ? 'administrateur' : 'utilisateur'}`
  showModal.value = true
}

const submitForm = async () => {
  formErrors.value = []
  const { username, email, emailConfirm, password, passwordConfirm, role } = form.value
  const errors = []

  if (!username || !email || !emailConfirm || !password || !passwordConfirm) {
    errors.push("Tous les champs sont obligatoires.")
  }
  if (email !== emailConfirm) {
    errors.push("Les emails ne correspondent pas.")
  }
  if (password !== passwordConfirm) {
    errors.push("Les mots de passe ne correspondent pas.")
  }

  if (errors.length > 0) {
    formErrors.value = errors
    return
  }

  formLoading.value = true
  try {
    await userService.createUserWithRole({ username, email, password, role })
    ElMessage.success('Compte créé avec succès.')
    showModal.value = false
    fetchUsers()
  } catch (err) {
    const response = err.response?.data
    if (response?.errors && Array.isArray(response.errors)) {
      formErrors.value = response.errors
    } else if (response?.message) {
      formErrors.value = [response.message]
    } else {
      formErrors.value = ["Une erreur inconnue est survenue."]
    }
  } finally {
    formLoading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const response = await userService.getAllUsers()
    users.value = response.data
  } catch (error) {
    ElMessage.error("Erreur lors du chargement des utilisateurs.")
  }
}

const toggleStatus = async (user) => {
  try {
    if (user.status === 'ACTIVE') {
      await userService.deactivateUser(user.id)
      ElMessage.success('Compte désactivé.')
    } else {
      await userService.activateUser(user.id)
      ElMessage.success('Compte activé.')
    }
    fetchUsers()
  } catch (error) {
    ElMessage.error("Erreur lors de la mise à jour du statut.")
  }
}

const deleteUser = async (id) => {
  try {
    await ElMessageBox.confirm(
      'Êtes-vous sûr de vouloir supprimer ce compte ?',
      'Confirmation',
      {
        type: 'warning',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
      }
    )
    await userService.deleteUser(id)
    ElMessage.success('Compte supprimé.')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error("Erreur lors de la suppression.")
    }
  }
}

const generateFilters = (key) => {
  const unique = [...new Set(users.value.map(u => u[key]))]
  return unique.map(val => ({ text: val, value: val }))
}

const filterHandler = (value, row, column) => {
  const prop = column.property
  return row[prop] === value
}

onMounted(fetchUsers)
</script>

<style scoped>
.el-dialog {
  transition: all 0.3s ease;
}
.el-dialog__body {
  padding: 20px 30px;
}
.el-dialog__footer {
  padding: 10px 30px 20px;
  text-align: right;
}
.auth-input {
  margin-bottom: 16px;
}
.el-dialog .el-button {
  min-width: 100px;
}
.auth-error {
  margin-top: 10px;
  margin-bottom: 20px;
}
.auth-error ul {
  margin: 0;
  padding-left: 1.2em;
}
.auth-error li {
  margin: 5px;
}
.password-help {
  display: block;
  margin-top: -10px;
  margin-bottom: 16px;
  color: #888;
}
.admin-users-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
}
.create-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}
.user-table {
  margin-top: 20px;
}
.table-pagination {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.action-button {
  min-width: 100px;
}
.section-label {
  text-align: left;
}
</style>
