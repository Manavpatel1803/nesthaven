import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index'; 

// Google Tag Manager Setup
(function(w,d,s,l){
  w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s);j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+process.env.VUE_APP_GTM_ID;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM_ID');

router.afterEach((to) => {
  document.title = to.meta.title || 'Student Journey Mentor';
});

createApp(App).use(router).mount('#app');