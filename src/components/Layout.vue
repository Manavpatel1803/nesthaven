<template>
    <div>
      <Navbar /> <!-- Your navigation component -->
      <router-view /> <!-- Renders the matched component -->
      <FooterComponent /> <!-- Your footer component -->
    </div>
  </template>
  
  <script>
  import FooterComponent from './AppFooter.vue'; // Adjust the path
  import Navbar from './Navbar.vue';
  
  export default {
    name: 'AppLayout',
    components: {
      Navbar,
      FooterComponent,
    },
  };
  </script>
  
  
  