<template>
  <h1 class="main-title">Connexion</h1>
  <el-container class="auth-container">
    <!-- Connexion -->
    <el-card class="auth-card" shadow="always">
      <h1 class="section-label">J’ai déjà un compte</h1>

      <el-form @submit.prevent="handleLogin" :model="{ username, password }" label-position="top">
        <el-input
          v-model="username"
          placeholder="Pseudo"
          clearable
          :disabled="loading"
          class="form-input"
        />

        <el-input
          v-model="password"
          placeholder="Mot de passe"
          show-password
          clearable
          :disabled="loading"
          class="form-input"
        />

        <div class="forgot-password">
          <router-link to="/forgot-password">Mot de passe oublié ?</router-link>
        </div>

        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          class="auth-error"
        />

        <el-form-item>
          <el-button
            type="success"
            native-type="submit"
            :loading="loading"
            :disabled="loading"
            class="auth-button"
          >
            Se connecter
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Inscription -->
    <el-card class="auth-card" shadow="always">
      <h1 class="section-label">Je crée mon compte</h1>

      <el-form @submit.prevent="handleRegister" :model="registerForm" label-position="top">
        <el-input v-model="registerForm.username" placeholder="Pseudo" clearable :disabled="registerLoading" class="form-input" />
        <el-input v-model="registerForm.email" placeholder="E-mail" clearable :disabled="registerLoading" class="form-input" />
        <el-input v-model="registerForm.emailConfirm" placeholder="Confirmation e-mail" clearable :disabled="registerLoading" class="form-input" />

        <el-input
          v-model="registerForm.password"
          placeholder="Mot de passe"
          show-password
          clearable
          :disabled="registerLoading"
          class="form-input"
        />

        <small class="small-text">
          Votre mot de passe de 8 caractères minimum, doit contenir au moins un chiffre, une minuscule, une majuscule et un caractère spécial (#@$!%*?&).
        </small>

        <el-input
          v-model="registerForm.passwordConfirm"
          placeholder="Confirmation mot de passe"
          show-password
          clearable
          :disabled="registerLoading"
          class="form-input"
        />

        <el-alert
          v-if="registerError && registerError.length"
          type="error"
          show-icon
          class="auth-error"
        >
          <ul>
            <li v-for="(msg, index) in registerError" :key="index">{{ msg }}</li>
          </ul>
        </el-alert>

        <el-form-item>
          <el-button
            type="success"
            native-type="submit"
            :loading="registerLoading"
            :disabled="registerLoading"
            class="auth-button"
          >
            Créer mon compte
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import userService from '../services/userService'
import { useAuth } from '../composables/useAuth'

const { setUser } = useAuth()

const router = useRouter()


const username = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const handleLogin = async () => {
  error.value = null

  if (!username.value || !password.value) {
    error.value = "Veuillez renseigner votre pseudo et votre mot de passe.";
    return;
  }

  loading.value = true
  try {
    const userData = await userService.login(username.value, password.value)
    setUser(userData)
    router.push({ path: '/', query: { successMessage: 'Connexion réussie !' } })
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de la connexion"
  } finally {
    loading.value = false
  }
}


const registerForm = ref({
  username: '',
  email: '',
  emailConfirm: '',
  password: '',
  passwordConfirm: ''
})

const registerError = ref(null)
const registerLoading = ref(false)

const handleRegister = async () => {
  registerError.value = [];

  const { username, email, emailConfirm, password, passwordConfirm } = registerForm.value;

  const errors = [];

   if (!username || !email || !emailConfirm || !password || !passwordConfirm) {
    errors.push("Tous les champs sont obligatoires.");
  }

  if (email !== emailConfirm) {
    errors.push("Les emails ne correspondent pas.");
  }

  if (password !== passwordConfirm) {
    errors.push("Les mots de passe ne correspondent pas.");
  }

  if (errors.length > 0) {
    registerError.value = errors;
    return;
  }

  registerLoading.value = true;
  try {
    const userData = await userService.registerAndLogin({ username, email, password })
    setUser(userData)

    router.push({ path: '/', query: { successMessage: 'Compte créé avec succès !' } })
  } catch (err) {
    const response = err.response?.data;

    if (response?.errors && Array.isArray(response.errors)) {
      registerError.value = response.errors;
    } else if (response?.message) {
      registerError.value = [response.message];
    } else {
      registerError.value = ["Une erreur inconnue est survenue."];
    }
  } finally {
    registerLoading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  flex-wrap: wrap;
}

.auth-card {
  width: 400px;
  padding: 30px;
}

.auth-button {
  width: 100%;
}

.auth-error {
  margin-bottom: 20px;
}

.auth-error ul {
  margin: 0;
  padding-left: 1.2em;
}

.auth-error li {
  margin: 5px;
}

.forgot-password {
  margin-top: -10px;
  margin-bottom: 16px;
}

.forgot-password a {
  color: #888;
  font-size: 13px;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.password-help {
  display: block;
  margin-top: -10px;
  margin-bottom: 16px;
}
</style>
