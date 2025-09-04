import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ResourceView from '@/views/ResourceView.vue'
import ResourceDetailView from '@/views/ResourceDetailView.vue'
import DiagnosticView from '@/views/DiagnosticView.vue'
import DiagnosticsView from '@/views/DiagnosticsView.vue'
import AdminUsersView from '@/views/admin/AdminUsersView.vue'
import AdminResourcesView from '@/views/admin/AdminResourcesView.vue'
import AdminDiagnosticsView from '@/views/admin/AdminDiagnosticsView.vue'
import NotFoundView from '@/views/NotFound.vue'
import ForgotPassword from '@/views/ForgotPasswordView.vue'
import ResetPassword from '@/views/ResetPasswordView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/ressources', name: 'Ressources', component: ResourceView },
  { path: '/ressources/:id', name: 'RessourceDetail', component: ResourceDetailView },
  { path: '/diagnostic', name: 'Diagnostic', component: DiagnosticView },
  { path: '/diagnostics', name: 'Diagnostics', component: DiagnosticsView },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },

  // Admin
  { path: '/admin/comptes', name: 'AdminUsers', component: AdminUsersView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/ressources', name: 'AdminResources', component: AdminResourcesView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/diagnostics', name: 'AdminDiagnostics', component: AdminDiagnosticsView, meta: { requiresAuth: true, requiresAdmin: true } },

  // Not Found
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { user } = useAuth()
  const isAuthenticated = !!user.value
  const isAdmin = user.value?.role?.name?.toUpperCase?.() === 'ADMIN'

  if (to.name === 'Login' && isAuthenticated) {
    return next({ name: 'Profile' })
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'Home' })
  }
  
  const adminAllowedRoutes = ['Home', 'Profile', 'AdminUsers', 'AdminResources', 'AdminDiagnostics']
    if (isAdmin && !adminAllowedRoutes.includes(to.name)) {
    return next({ name: 'Home' })
  }

  next()
})

export default router
