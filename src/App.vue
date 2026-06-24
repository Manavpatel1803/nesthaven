<template>
  <div id="app">
    <Navbar />
    <router-view />  <!-- This will dynamically load the current route's component -->
    <AppFooter />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    AppFooter
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import './assets/Css/nicepage.css';
@import './assets/Css/tailwind.css';
@import './assets/Css/Contact.css';

* { box-sizing: border-box; }
body { font-family: 'Inter', 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #F9FAFB; }
#app { display: flex; flex-direction: column; min-height: 100vh; }
router-view { flex: 1; }




</style>
