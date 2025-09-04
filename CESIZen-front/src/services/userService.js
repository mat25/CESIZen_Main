import api from '@/services/axiosClient';
import { useAuth } from '@/composables/useAuth'

const API_URL = import.meta.env.VITE_API_URL

const userService = {
  
  async login(username, password) {
    const response = await api.post(`${API_URL}/auth/login`, { username, password });
    
    localStorage.setItem('token', response.data.token);

    const userResponse = await this.getMe();
    
    const { setUser } = useAuth()
    setUser(userResponse.data)

    return userResponse.data;
  },
  
  register({ username, email, password }) {
    return api.post('/auth/register', {
      username,
      email,
      password
    });
  },

  async registerAndLogin({ username, email, password }) {
    
    await this.register({ username, email, password })

    const userResponse = await this.login(username, password)

    return userResponse
  },

  createUserWithRole({ username, email, password, role }) {
    return api.post('/auth/admin/users', {
      username,
      email,
      password,
      role
    });
  },


  getMe() {
  return api.get('/users/me');
  },

  updateProfile({ username, email }) {
    return api.patch('/users/me', { username, email });
  },

  updatePassword({ oldPassword, newPassword }) {
    return api.patch('/users/me/password', { oldPassword, newPassword });
  },

  logout() {
    const { clearUser } = useAuth()

    localStorage.removeItem('token')
    clearUser()

    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }

    console.warn('Déconnexion effectuée.')
  },

  deleteAccount() {
    return api.delete('/users/me');
  },

  getPersonalData() {
    return api.get('/users/me/data');
  },

  deletePersonalData() {
    return api.delete('/users/me/data');
  },

  getAllUsers() {
    return api.get('/users');
  },

  activateUser(id) {
    return api.patch(`/users/${id}/activate`);
  },

  deactivateUser(id) {
    return api.patch(`/users/${id}/deactivate`);
  },

  deleteUser(id) {
    return api.delete(`/users/${id}`);
  },

  requestPasswordReset(email) {
    return api.post(`${API_URL}/auth/reset-password/request`, { email });
  },
  confirmPasswordReset(token, newPassword) {
    return api.post(`${API_URL}/auth/reset-password/confirm`, { token, newPassword });
  },
}
  
export default userService