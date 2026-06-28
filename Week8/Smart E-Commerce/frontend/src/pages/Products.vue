<template>
  <div class="products-wrapper">
    <div class="bg-grid"></div>

    <nav>
      <div class="nav-container">
        <div class="logo">GameGear Pro</div>
        <div class="nav-right">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <button class="logout-btn" @click="handleLogout">Logout</button>
        </div>
      </div>
    </nav>

    <div class="container">
      <div class="header">
        <h1 class="page-title">Gaming Appliances</h1>
        <p class="page-subtitle">Premium gaming gear & accessories</p>
      </div>

      <div class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image">
            <div class="placeholder">{{ product.category }}</div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-category">{{ product.category }}</p>
            <div class="product-price">KES {{ product.price }}</div>
            <button class="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const products = ref([
  { id: 1, name: 'Gaming Mouse', category: 'Peripherals', price: 2500 },
  { id: 2, name: 'Mechanical Keyboard', category: 'Peripherals', price: 5000 },
  { id: 3, name: 'Gaming Headset', category: 'Audio', price: 3500 },
  { id: 4, name: 'Monitor 144Hz', category: 'Displays', price: 18000 },
  { id: 5, name: 'Mouse Pad', category: 'Accessories', price: 800 },
  { id: 6, name: 'RGB Lighting', category: 'Accessories', price: 2000 },
  { id: 7, name: 'USB Hub', category: 'Connectivity', price: 1500 },
  { id: 8, name: 'Phone Cooler', category: 'Mobile', price: 1200 },
  { id: 9, name: 'Gaming Trigger', category: 'Mobile', price: 600 },
  { id: 10, name: 'Phone Stand', category: 'Accessories', price: 500 },
  { id: 11, name: 'Cable Organizer', category: 'Accessories', price: 400 },
  { id: 12, name: 'GPU Cooling Fan', category: 'Cooling', price: 3000 },
])

const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }
}

onMounted(() => {
  const currentUser = localStorage.getItem('currentUser')
  if (!currentUser) {
    router.push('/login')
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
}

.products-wrapper {
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
  pointer-events: none;
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
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--text);
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.nav-link:hover {
  color: var(--primary);
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

.header {
  text-align: center;
  margin-bottom: 3rem;
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

.page-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-dim);
  letter-spacing: 1px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  animation: slideUp 0.6s ease-out 0.2s backwards;
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

.product-card {
  background: var(--card-bg);
  border: 2px solid rgba(0, 255, 136, 0.2);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  border-color: var(--primary);
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 255, 136, 0.2);
}

.product-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 212, 255, 0.1));
  border-bottom: 2px solid rgba(0, 255, 136, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.product-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.placeholder {
  font-size: 1.2rem;
  color: var(--accent);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
}

.product-info {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-category {
  font-size: 0.9rem;
  color: var(--accent);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-price {
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--primary);
  margin-bottom: 1rem;
  font-family: 'Orbitron', sans-serif;
}

.add-to-cart-btn {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border: none;
  border-radius: 6px;
  color: var(--dark);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: auto;
}

.add-to-cart-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 255, 136, 0.4);
}

.add-to-cart-btn:active {
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .page-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .nav-container {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .logo {
    font-size: 1.4rem;
  }

  .nav-right {
    gap: 1rem;
  }

  .container {
    padding: 1rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .page-title {
    font-size: 1.8rem;
    letter-spacing: 2px;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .product-image {
    height: 150px;
  }

  .product-info {
    padding: 1rem;
  }

  .product-name {
    font-size: 1rem;
  }

  .product-price {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  nav {
    padding: 1rem;
  }

  .nav-right {
    flex-direction: column;
    gap: 0.5rem;
  }

  .logo {
    font-size: 1.2rem;
  }

  .container {
    padding: 1rem 0.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  .page-title {
    font-size: 1.4rem;
    letter-spacing: 1px;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .product-image {
    height: 120px;
  }

  .placeholder {
    font-size: 0.9rem;
    letter-spacing: 1px;
  }

  .product-info {
    padding: 0.8rem;
  }

  .product-name {
    font-size: 0.9rem;
  }

  .product-category {
    font-size: 0.8rem;
  }

  .product-price {
    font-size: 1.2rem;
  }

  .add-to-cart-btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}
</style>
