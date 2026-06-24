import { createRouter, createWebHistory } from 'vue-router';

// Import your components
import Home from '@/Pages/Home.vue';
import Accommodation from '@/Pages/Accommodation.vue';
import About from '@/Pages/About.vue';
import Contacts from '@/Pages/Contacts.vue';
import PropertyDetails from '@/Pages/PropertyDetails.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home - NestHaven'
    }
  },
  {
    path: '/accommodation',
    name: 'Accommodation',
    component: Accommodation,
    meta: {
      title: 'Find a Property - NestHaven'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'About Us - NestHaven'
    }
  },
  {
    path: '/contact',
    name: 'Contacts',
    component: Contacts,
    meta: {
      title: 'Contact Us - NestHaven'
    }
  },
  {
    path: '/property/:offerid',
    name: 'PropertyDetails',
    component: PropertyDetails,
    meta: {
      title: 'Property Details - NestHaven'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
