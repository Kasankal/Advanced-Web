<template>
  <div class="register-wrapper">
    <div class="bg-grid"></div>

    <div class="content">
      <div class="register-container">
        <div class="register-header">
          <div class="logo">GameGear Pro</div>
          <h1 class="register-title">Create Your Account</h1>
          <p class="register-subtitle">Join the Gaming Revolution</p>
        </div>

        <div v-if="alert.message" :class="['alert', alert.type, 'show']">
          {{ alert.message }}
        </div>

        <form @submit.prevent="handleRegister" class="register-form" novalidate>
          <!-- Username Field -->
          <div class="form-group">
            <label class="form-label" for="username">Username</label>
            <input
              type="text"
              id="username"
              v-model="form.username"
              class="form-input"
              :class="{ error: errors.username, success: validated.username }"
              placeholder="Choose your gaming username"
              @blur="validateField('username')"
              @input="clearFieldError('username')"
              required
              minlength="3"
              maxlength="20"
            />
            <div v-if="errors.username" class="error-message show">
              {{ errors.username }}
            </div>
            <div v-if="validated.username" class="success-message show">✓ Username looks good!</div>
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="form-input"
              :class="{ error: errors.email, success: validated.email }"
              placeholder="Enter your email"
              @blur="validateField('email')"
              @input="clearFieldError('email')"
              required
            />
            <div v-if="errors.email" class="error-message show">
              {{ errors.email }}
            </div>
            <div v-if="validated.email" class="success-message show">✓ Email is valid!</div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              class="form-input"
              :class="{ error: errors.password, success: validated.password }"
              placeholder="Create a strong password"
              @blur="validateField('password')"
              @input="clearFieldError('password')"
              required
              minlength="6"
              maxlength="50"
            />
            <div v-if="errors.password" class="error-message show">
              {{ errors.password }}
            </div>
            <div v-if="validated.password" class="success-message show">
              ✓ Password strength: Good!
            </div>
            <div class="password-requirements">
              <span :class="{ met: passwordMet.length }">• At least 6 characters</span>
              <span :class="{ met: passwordMet.letter }">• Contains a letter</span>
              <span :class="{ met: passwordMet.number }">• Contains a number</span>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-group">
            <label class="form-label" for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="form.confirmPassword"
              class="form-input"
              :class="{ error: errors.confirmPassword, success: validated.confirmPassword }"
              placeholder="Confirm your password"
              @blur="validateField('confirmPassword')"
              @input="clearFieldError('confirmPassword')"
              required
              minlength="6"
              maxlength="50"
            />
            <div v-if="errors.confirmPassword" class="error-message show">
              {{ errors.confirmPassword }}
            </div>
            <div v-if="validated.confirmPassword" class="success-message show">
              ✓ Passwords match!
            </div>
          </div>

          <!-- Terms & Conditions -->
          <label class="terms-checkbox">
            <input type="checkbox" v-model="form.agreeTerms" required />
            <span>I agree to the <a href="#">Terms & Conditions</a></span>
          </label>
          <div v-if="errors.terms" class="error-message show">
            {{ errors.terms }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="submit-btn"
            :disabled="loading"
            :class="{ loading: loading }"
          >
            {{ loading ? '' : 'Create Account' }}
          </button>
        </form>

        <!-- Login Link -->
        <div class="login-link">
          Already have an account? <router-link to="/login">Login here</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: '',
})

const validated = ref({
  username: false,
  email: false,
  password: false,
  confirmPassword: false,
})

const alert = ref({
  message: '',
  type: '',
})

const loading = ref(false)

const passwordMet = computed(() => ({
  length: form.value.password.length >= 6,
  letter: /[a-zA-Z]/.test(form.value.password),
  number: /[0-9]/.test(form.value.password),
}))

const validationRules = {
  username: {
    required: 'Username is required',
    minLength: 'Username must be at least 3 characters',
    maxLength: 'Username must not exceed 20 characters',
    pattern: 'Username can only contain letters, numbers, and underscores',
    validate: (value) => /^[a-zA-Z0-9_]+$/.test(value),
  },
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 6 characters',
    strength: 'Password must contain both letters and numbers',
  },
  confirmPassword: {
    required: 'Please confirm your password',
    match: 'Passwords do not match',
  },
}

const validateField = (fieldName) => {
  const value = form.value[fieldName].trim()
  const rules = validationRules[fieldName]

  errors.value[fieldName] = ''
  validated.value[fieldName] = false

  // Username validation
  if (fieldName === 'username') {
    if (!value) {
      errors.value.username = rules.required
      return false
    }
    if (value.length < 3) {
      errors.value.username = rules.minLength
      return false
    }
    if (value.length > 20) {
      errors.value.username = rules.maxLength
      return false
    }
    if (!rules.validate(value)) {
      errors.value.username = rules.pattern
      return false
    }
  }

  // Email validation
  if (fieldName === 'email') {
    if (!value) {
      errors.value.email = rules.required
      return false
    }
    if (!rules.validate(value)) {
      errors.value.email = rules.invalid
      return false
    }
  }

  // Password validation
  if (fieldName === 'password') {
    if (!value) {
      errors.value.password = rules.required
      return false
    }
    if (value.length < 6) {
      errors.value.password = rules.minLength
      return false
    }
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      errors.value.password = rules.strength
      return false
    }
  }

  // Confirm password validation
  if (fieldName === 'confirmPassword') {
    if (!value) {
      errors.value.confirmPassword = rules.required
      return false
    }
    if (value !== form.value.password) {
      errors.value.confirmPassword = rules.match
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

const handleRegister = async () => {
  // Validate all fields
  const isUsernameValid = validateField('username')
  const isEmailValid = validateField('email')
  const isPasswordValid = validateField('password')
  const isConfirmPasswordValid = validateField('confirmPassword')

  if (!form.value.agreeTerms) {
    errors.value.terms = 'You must agree to the terms and conditions'
  }

  if (
    !isUsernameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid ||
    !form.value.agreeTerms
  ) {
    showAlert('Please fix the errors above', 'error')
    return
  }

  loading.value = true

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: form.value.username.trim(),
        email: form.value.email.trim(),
        password: form.value.password,
        confirmPassword: form.value.confirmPassword,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // Auto-login after registration
      localStorage.setItem('currentUser', JSON.stringify(data.user))
      showAlert('Account created! Redirecting to dashboard...', 'success')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else {
      showAlert(data.message || 'Registration failed. Please try again.', 'error')
    }
  } catch (error) {
    console.error('Registration error:', error)
    showAlert('An error occurred. Please try again later.', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Redirect if already logged in
  if (localStorage.getItem('currentUser')) {
    router.push('/dashboard')
  }
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
  --success: #4caf50;
}

.register-wrapper {
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
  max-width: 550px;
  padding: 2rem;
}

.register-container {
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

.register-header {
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
}

.register-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.register-subtitle {
  color: var(--text-dim);
  font-size: 1rem;
  margin-top: 0.5rem;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: none;
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
  border-color: var(--success);
  color: var(--success);
}

.register-form {
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
}

.form-input.error {
  border-color: var(--error);
  box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
}

.form-input.success {
  border-color: var(--success);
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

.error-message {
  font-size: 0.9rem;
  color: var(--error);
  display: none;
  font-weight: 600;
  margin-top: -0.4rem;
}

.success-message {
  font-size: 0.9rem;
  color: var(--success);
  display: none;
  font-weight: 600;
  margin-top: -0.4rem;
}

.error-message.show,
.success-message.show {
  display: block;
}

.password-requirements {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--text-dim);
  margin-top: 0.5rem;
}

.password-requirements span.met {
  color: var(--success);
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.terms-checkbox input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}

.terms-checkbox a {
  color: var(--primary);
  text-decoration: none;
}

.terms-checkbox a:hover {
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

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(0, 255, 136, 0.2);
  color: var(--text-dim);
}

.login-link a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s;
}

.login-link a:hover {
  color: var(--accent);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-container {
    padding: 2rem 1.5rem;
  }

  .logo {
    font-size: 2rem;
  }

  .register-title {
    font-size: 1.2rem;
  }
}
</style>
