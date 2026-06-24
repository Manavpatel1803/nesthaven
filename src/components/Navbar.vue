<template>
  <header class="nh-header">
    <div class="nh-container">
      <!-- Logo -->
      <a href="/" class="nh-logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3L2 13.5V30H12V21H20V30H30V13.5L16 3Z" fill="#4F46E5"/>
          <path d="M16 3L2 13.5V30H12V21H20V30H30V13.5L16 3Z" fill="url(#logoGrad)"/>
          <defs>
            <linearGradient id="logoGrad" x1="2" y1="3" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stop-color="#4F46E5"/>
              <stop offset="1" stop-color="#7C3AED"/>
            </linearGradient>
          </defs>
        </svg>
        <span class="nh-logo-text">Nest<span class="nh-logo-accent">Haven</span></span>
      </a>

      <!-- Desktop Nav -->
      <nav class="nh-nav">
        <router-link class="nh-nav-link" to="/">Home</router-link>
        <router-link class="nh-nav-link" to="/accommodation">Find a Property</router-link>
        <router-link class="nh-nav-link" to="/about">About Us</router-link>
        <router-link class="nh-nav-link" to="/contact">Contact</router-link>
      </nav>

      <!-- Auth / CTA -->
      <div class="nh-actions">
        <div v-if="user" class="nh-profile">
          <img :src="user.picture" :alt="user.name" class="nh-avatar" @click="toggleDropdown" />
          <div v-if="isDropdownOpen" class="nh-dropdown">
            <p class="nh-dropdown-name">{{ user.name }}</p>
            <p class="nh-dropdown-email">{{ user.email }}</p>
            <button @click="googleSignOut" class="nh-logout-btn">Sign Out</button>
          </div>
        </div>
        <router-link v-else to="/contact" class="nh-cta-btn">List Your Property</router-link>
      </div>

      <!-- Hamburger -->
      <button class="nh-hamburger" @click="toggleMenu">
        <span :class="['nh-bar', { open: isMenuOpen }]"></span>
        <span :class="['nh-bar', { open: isMenuOpen }]"></span>
        <span :class="['nh-bar', { open: isMenuOpen }]"></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div :class="['nh-mobile-nav', { active: isMenuOpen }]">
      <router-link class="nh-mobile-link" to="/" @click="closeMenu">Home</router-link>
      <router-link class="nh-mobile-link" to="/accommodation" @click="closeMenu">Find a Property</router-link>
      <router-link class="nh-mobile-link" to="/about" @click="closeMenu">About Us</router-link>
      <router-link class="nh-mobile-link" to="/contact" @click="closeMenu">Contact</router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppNavbar",
  data() {
    return {
      isMenuOpen: false,
      isDropdownOpen: false,
      user: null,
    };
  },
  methods: {
    toggleMenu() { this.isMenuOpen = !this.isMenuOpen; },
    closeMenu() { this.isMenuOpen = false; },
    toggleDropdown() { this.isDropdownOpen = !this.isDropdownOpen; },
    googleSignOut() {
      this.user = null;
      localStorage.removeItem("user");
      window.location.reload();
    },
    handleCredentialResponse(response) {
      const data = this.decodeJwt(response.credential);
      this.user = { name: data.name, email: data.email, picture: data.picture };
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    decodeJwt(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    },
    loadGoogleScript() {
      if (document.getElementById("google-jssdk")) return;
      const script = document.createElement("script");
      script.id = "google-jssdk";
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = this.initGoogleSignIn;
      document.head.appendChild(script);
    },
    initGoogleSignIn() {
      if (window.google) {
        google.accounts.id.initialize({
          client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
          callback: this.handleCredentialResponse
        });
        google.accounts.id.prompt();
      }
    }
  },
  mounted() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) this.user = JSON.parse(storedUser);
    this.loadGoogleScript();
  }
};
</script>

<style scoped>
.nh-header {
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.nh-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 32px;
}

/* Logo */
.nh-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.nh-logo-text {
  font-size: 1.4rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5px;
}
.nh-logo-accent { color: #4F46E5; }

/* Desktop Nav */
.nh-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}
.nh-nav-link {
  text-decoration: none;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}
.nh-nav-link:hover,
.nh-nav-link.router-link-active {
  background: #EEF2FF;
  color: #4F46E5;
}

/* Actions */
.nh-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.nh-cta-btn {
  background: #4F46E5;
  color: #fff;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
  white-space: nowrap;
}
.nh-cta-btn:hover { background: #3730A3; }

/* Profile */
.nh-profile { position: relative; }
.nh-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid #E5E7EB;
}
.nh-dropdown {
  position: absolute;
  top: 48px; right: 0;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 12px;
  min-width: 180px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.nh-dropdown-name { font-weight: 600; font-size: 0.9rem; color: #111827; margin: 0 0 2px; }
.nh-dropdown-email { font-size: 0.8rem; color: #6B7280; margin: 0 0 10px; }
.nh-logout-btn {
  width: 100%;
  padding: 7px;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
.nh-logout-btn:hover { background: #374151; }

/* Hamburger */
.nh-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}
.nh-bar {
  display: block;
  width: 24px; height: 2px;
  background: #374151;
  border-radius: 2px;
  transition: all 0.3s;
}

/* Mobile Nav */
.nh-mobile-nav {
  display: none;
  flex-direction: column;
  background: #fff;
  border-top: 1px solid #E5E7EB;
  padding: 8px 24px 16px;
}
.nh-mobile-nav.active { display: flex; }
.nh-mobile-link {
  text-decoration: none;
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
  padding: 12px 0;
  border-bottom: 1px solid #F3F4F6;
}
.nh-mobile-link:last-child { border-bottom: none; }

@media (max-width: 768px) {
  .nh-nav, .nh-actions { display: none; }
  .nh-hamburger { display: flex; }
}
</style>
