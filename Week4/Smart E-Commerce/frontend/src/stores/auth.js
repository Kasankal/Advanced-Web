import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const setUser = (userData) => {
    user.value = userData
    isAuthenticated.value = true
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('currentUser')
  }

  const loadUser = () => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      user.value = JSON.parse(stored)
      isAuthenticated.value = true
    }
  }

  return { user, isAuthenticated, setUser, clearUser, loadUser }
})
