<template>
  <div class="login-wrapper">
    <div class="bg-grid"></div>

    <div class="content">
      <div class="login-container">
        <div class="login-header">
          <div class="logo">GameGear Pro</div>
          <h1 class="login-title">Player Login</h1>
          <p class="login-subtitle">Level Up Your Gaming Experience</p>
        </div>

        <div v-if="alert.message" :class="['alert', alert.type, 'show']">
          {{ alert.message }}
        </div>

        <form @submit.prevent="handleLogin" class="login-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="username">Username</label>
            <input
              type="text"
              id="username"
              v-model="form.username"
              class="form-input"
              :class="{ error: errors.username, success: validated.username }"
              placeholder="Enter your username"
              @blur="validateField('username')"
              @input="clearFieldError('username')"
              required
              minlength="3"
              maxlength="20"
            />
            <div v-if="errors.username" class="error-message show">
              {{ errors.username }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              class="form-input"
              :class="{ error: errors.password, success: validated.password }"
              placeholder="Enter your password"
              @blur="validateField('password')"
              @input="clearFieldError('password')"
              required
              minlength="6"
              maxlength="50"
            />
            <div v-if="errors.password" class="error-message show">
              {{ errors.password }}
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="form.rememberMe" />
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            class="submit-btn"
            :disabled="loading"
            :class="{ loading: loading }"
          >
            {{ loading ? '' : 'Login to GameGear Pro' }}
          </button>
        </form>

        <div class="signup-link">
          Don't have an account? <router-link to="/register">Create one now</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  username: '',
  password: '',
  rememberMe: false,
})

const errors = ref({
  username: '',
  password: '',
})

const validated = ref({
  username: false,
  password: false,
})

const alert = ref({
  message: '',
  type: '',
})

const loading = ref(false)

const validationRules = {
  username: {
    required: 'Username is required',
    minLength: 'Username must be at least 3 characters',
    pattern: 'Username can only contain letters, numbers, and underscores',
    validate: (value) => /^[a-zA-Z0-9_]+$/.test(value),
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 6 characters',
    strength: 'Password must contain letters and numbers',
  },
}

const validateField = (fieldName) => {
  const value = form.value[fieldName].trim()
  const rules = validationRules[fieldName]

  errors.value[fieldName] = ''
  validated.value[fieldName] = false

  if (!value) {
    errors.value[fieldName] = rules.required
    return false
  }

  if (value.length < (fieldName === 'username' ? 3 : 6)) {
    errors.value[fieldName] = rules.minLength
    return false
  }

  if (fieldName === 'username') {
    if (!rules.validate(value)) {
      errors.value[fieldName] = rules.pattern
      return false
    }
  }

  if (fieldName === 'password') {
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      errors.value[fieldName] = rules.strength
      return false
    }
  }

  validated.value[fieldName] = true
  return true
}

const clearFieldError = (fieldName) => {
  if (errors.value[fieldName]) {
    errors.value[fieldName] = ''
  }
}

const showAlert = (message, type) => {
  alert.value = { message, type }
  setTimeout(() => {
    alert.value = { message: '', type: '' }
  }, 5000)
}

const handleLogin = async () => {
  const isUsernameValid = validateField('username')
  const isPasswordValid = validateField('password')

  if (!isUsernameValid || !isPasswordValid) {
    showAlert('Please fix the errors above', 'error')
    return
  }

  loading.value = true

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: form.value.username.trim(),
        password: form.value.password,
        rememberMe: form.value.rememberMe,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      if (form.value.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('username', form.value.username.trim())
      }

      localStorage.setItem('currentUser', JSON.stringify(data.user))

      showAlert('Login successful! Redirecting...', 'success')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else {
      showAlert(data.message || 'Login failed. Please try again.', 'error')
    }
  } catch (error) {
    console.error('Login error:', error)
    showAlert('An error occurred. Please try again later.', 'error')
  } finally {
    loading.value = false
  }
}

const loadRememberedData = () => {
  if (localStorage.getItem('rememberMe') === 'true') {
    form.value.rememberMe = true
    form.value.username = localStorage.getItem('username') || ''
  }
}

onMounted(() => {
  loadRememberedData()
})
</script>

<style scoped>
:root {
  --primary: #00ff88;
  --secondary: #ff0080;
  --accent: #00d4ff;
  --dark: #0a0e27;
  --darker: #050812;
  --card-bg: #131729;
  --text: #ffffff;
  --text-dim: #a0a8c0;
  --error: #ff4444;
}

.login-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--darker);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'Rajdhani', sans-serif;
  color: var(--text);
}

.bg-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 0;
  animation: gridScroll 20s linear infinite;
}

@keyframes gridScroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(50px);
  }
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
}

.login-container {
  background: var(--card-bg);
  border: 2px solid rgba(0, 255, 136, 0.3);
  border-radius: 16px;
  padding: 3rem 2.5rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(0, 255, 136, 0.15);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  animation: logoPulse 2s ease-in-out infinite;
}

@keyframes logoPulse {
  0%,
  100% {
    filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(0, 255, 136, 0.6));
  }
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.login-subtitle {
  color: var(--text-dim);
  font-size: 1rem;
  margin-top: 0.5rem;
  letter-spacing: 0.5px;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: none;
  animation: slideDown 0.3s ease-out;
  font-weight: 600;
  border: 2px solid;
}

.alert.show {
  display: block;
}

.alert.error {
  background: rgba(255, 68, 68, 0.1);
  border-color: var(--error);
  color: var(--error);
}

.alert.success {
  background: rgba(76, 175, 80, 0.1);
  border-color: #4caf50;
  color: #4caf50;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent);
  letter-spacing: 1px;
}

.form-input {
  padding: 1rem 1.2rem;
  background: rgba(19, 23, 41, 0.8);
  border: 2px solid rgba(0, 255, 136, 0.2);
  border-radius: 8px;
  color: var(--text);
  font-size: 1.1rem;
  font-family: 'Rajdhani', sans-serif;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
  background: rgba(19, 23, 41, 1);
}

.form-input::placeholder {
  color: var(--text-dim);
}

.form-input.error {
  border-color: var(--error);
  box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
}

.form-input.success {
  border-color: #4caf50;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

.error-message {
  font-size: 0.9rem;
  color: var(--error);
  display: none;
  animation: slideDown 0.3s ease-out;
  font-weight: 600;
  margin-top: -0.4rem;
}

.error-message.show {
  display: block;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.remember-me input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}

.forgot-password {
  color: var(--accent);
  text-decoration: none;
  transition: all 0.3s;
}

.forgot-password:hover {
  color: var(--primary);
  text-decoration: underline;
}

.submit-btn {
  padding: 1.2rem;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border: none;
  border-radius: 8px;
  color: var(--dark);
  font-size: 1.2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Rajdhani', sans-serif;
  box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 255, 136, 0.5);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn.loading {
  position: relative;
  color: transparent;
}

.submit-btn.loading::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  margin-left: -10px;
  margin-top: -10px;
  border: 3px solid rgba(10, 14, 39, 0.3);
  border-radius: 50%;
  border-top-color: var(--dark);
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(0, 255, 136, 0.2);
  color: var(--text-dim);
}

.signup-link a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s;
}

.signup-link a:hover {
  color: var(--accent);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    padding: 2rem 1.5rem;
  }

  .logo {
    font-size: 2rem;
  }

  .login-title {
    font-size: 1.2rem;
  }
}
</style>
