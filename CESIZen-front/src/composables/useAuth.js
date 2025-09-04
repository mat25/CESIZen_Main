import { ref, computed } from 'vue'

const user = ref(null)

function loadUser() {
  try {
    const stored = localStorage.getItem('user')
    user.value = stored ? JSON.parse(stored) : null
  } catch {
    user.value = null
  }
}

function setUser(newUser) {
  user.value = newUser
  localStorage.setItem('user', JSON.stringify(newUser))
}

function clearUser() {
  user.value = null
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

const userRole = computed(() => user.value?.role || null)

loadUser()

export function useAuth() {
  return {
    user,
    userRole,
    setUser,
    clearUser
  }
}
