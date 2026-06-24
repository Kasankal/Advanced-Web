<template>
  <div class="dashboard-wrapper">
    <div class="bg-grid"></div>

    <nav>
      <div class="nav-container">
        <div class="logo">GameGear Pro</div>
        <div class="nav-right">
          <div class="user-info">
            <div class="user-avatar">{{ userInitial }}</div>
            <div class="user-details">
              <div class="user-name">{{ currentUser?.username || 'Player' }}</div>
              <div class="user-role">{{ currentUser?.role || 'user' }}</div>
            </div>
          </div>
          <button class="logout-btn" @click="handleLogout">Logout</button>
        </div>
      </div>
    </nav>

    <div class="container">
      <div class="welcome-section">
        <h1 class="welcome-title">Level Up, Player!</h1>
        <p class="welcome-subtitle">Welcome to GameGear Pro</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"></div>
          <div class="stat-label">Cart Items</div>
          <div class="stat-value">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"></div>
          <div class="stat-label">Wishlist</div>
          <div class="stat-value">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"></div>
          <div class="stat-label">Orders</div>
          <div class="stat-value">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"></div>
          <div class="stat-label">Points</div>
          <div class="stat-value">0</div>
        </div>
      </div>

      <div class="action-buttons">
        <router-link to="/" class="action-btn">
          <span class="icon">🎮</span>
          <span>Browse Products</span>
        </router-link>
        <router-link to="/cart" class="action-btn">
          <span class="icon"></span>
          <span>View Cart</span>
        </router-link>
        <a href="#profile" class="action-btn">
          <span class="icon"></span>
          <span>My Profile</span>
        </a>
        <a href="#orders" class="action-btn">
          <span class="icon"></span>
          <span>My Orders</span>
        </a>
      </div>

      <div class="session-card">
        <h2 class="session-title">Session Information</h2>
        <div class="session-info-grid">
          <div class="info-item">
            <div class="info-label">Username</div>
            <div class="info-value">{{ currentUser?.username || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">{{ currentUser?.email || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Role</div>
            <div class="info-value">{{ currentUser?.role || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value" style="color: #4caf50">Active</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)

const userInitial = computed(() => {
  if (currentUser.value?.username) {
    return currentUser.value.username.charAt(0).toUpperCase()
  }
  return 'G'
})

const loadUserData = async () => {
  try {
    const response = await fetch('/api/session')
    const data = await response.json()

    if (data.isAuthenticated && data.user) {
      currentUser.value = data.user
    } else {
      router.push('/login')
    }
  } catch (error) {
    console.error('Error loading user data:', error)
    router.push('/login')
  }
}

const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('currentUser')
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(() => {
  loadUserData()
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
}

.dashboard-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--darker);
  color: var(--text);
  overflow-x: hidden;
  font-family: 'Rajdhani', sans-serif;
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

nav {
  background: rgba(10, 14, 39, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(0, 255, 136, 0.2);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 30px rgba(0, 255, 136, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.5rem;
  background: rgba(0, 255, 136, 0.1);
  border: 2px solid rgba(0, 255, 136, 0.2);
  border-radius: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  text-transform: uppercase;
  font-size: 1.2rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 700;
  font-size: 1rem;
}

.user-role {
  font-size: 0.85rem;
  color: var(--accent);
  text-transform: capitalize;
}

.logout-btn {
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 2px solid var(--secondary);
  color: var(--secondary);
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 1px;
}

.logout-btn:hover {
  background: var(--secondary);
  color: white;
  box-shadow: 0 0 20px rgba(255, 0, 128, 0.4);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.welcome-section {
  text-align: center;
  margin: 3rem 0;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), var(--accent), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1rem;
}

.welcome-subtitle {
  font-size: 1.3rem;
  color: var(--text-dim);
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.stat-card {
  background: var(--card-bg);
  border: 2px solid rgba(0, 255, 136, 0.2);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.stat-card:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 255, 136, 0.2);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.stat-label {
  color: var(--text-dim);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--primary);
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
}

.action-btn {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 212, 255, 0.1));
  border: 2px solid rgba(0, 255, 136, 0.3);
  border-radius: 12px;
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.action-btn:hover {
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 212, 255, 0.2));
  border-color: var(--primary);
  box-shadow: 0 8px 24px rgba(0, 255, 136, 0.2);
  transform: translateY(-3px);
}

.icon {
  font-size: 1.5rem;
}

.session-card {
  background: var(--card-bg);
  border: 2px solid rgba(0, 255, 136, 0.2);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 3rem;
  animation: slideUp 0.6s ease-out 0.3s backwards;
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

.session-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
}

.session-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  color: var(--accent);
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.info-value {
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
