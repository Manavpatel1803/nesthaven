<template>
  <footer class="nh-footer">
    <div class="footer-main">
      <div class="footer-brand">
        <a href="/" class="footer-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L2 13.5V30H12V21H20V30H30V13.5L16 3Z" fill="url(#fg)"/>
            <defs>
              <linearGradient id="fg" x1="2" y1="3" x2="30" y2="30">
                <stop stop-color="#4F46E5"/><stop offset="1" stop-color="#7C3AED"/>
              </linearGradient>
            </defs>
          </svg>
          <span>Nest<strong>Haven</strong></span>
        </a>
        <p class="footer-tagline">The UK's trusted accommodation platform — thousands of verified properties, zero hidden fees.</p>
        <div class="footer-socials">
          <a href="#" class="social-btn" title="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://www.instagram.com" target="_blank" class="social-btn" title="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
          </a>
          <a href="#" class="social-btn" title="Twitter / X">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </div>

      <div class="footer-links">
        <div class="footer-col">
          <h5>Properties</h5>
          <router-link to="/accommodation">Browse All</router-link>
          <router-link to="/accommodation">Rooms to Rent</router-link>
          <router-link to="/accommodation">Shared Houses</router-link>
          <router-link to="/accommodation">Studio Flats</router-link>
          <router-link to="/accommodation">Entire Homes</router-link>
        </div>
        <div class="footer-col">
          <h5>Company</h5>
          <router-link to="/about">About Us</router-link>
          <router-link to="/contact">Contact</router-link>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Blog</a>
        </div>
        <div class="footer-col">
          <h5>Support</h5>
          <a href="#">Help Centre</a>
          <a href="#">Safety Tips</a>
          <a href="#">Report a Listing</a>
          <a href="#">Landlord Guide</a>
          <router-link to="/contact">List Your Property</router-link>
        </div>
        <div class="footer-col">
          <h5>Contact</h5>
          <a href="mailto:admin@nesthaven.co.uk">admin@nesthaven.co.uk</a>
          <a href="tel:+442012345678">+44 (0) 20 1234 5678</a>
          <p class="footer-addr">123 High Street<br>London, EC1A 1BB</p>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© {{ currentYear }} NestHaven Ltd. All rights reserved.</span>
      <div class="footer-legal">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Cookie Policy</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() { return new Date().getFullYear(); }
  }
};
</script>

<style scoped>
.nh-footer {
  background: #111827;
  color: #D1D5DB;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* Main */
.footer-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px 40px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 64px;
}

/* Brand */
.footer-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; margin-bottom: 16px;
}
.footer-logo span { font-size: 1.3rem; font-weight: 600; color: #fff; }
.footer-logo strong { color: #818CF8; }
.footer-tagline { font-size: 0.875rem; color: #9CA3AF; line-height: 1.65; margin: 0 0 24px; }
.footer-socials { display: flex; gap: 10px; }
.social-btn {
  width: 36px; height: 36px;
  background: #1F2937;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #9CA3AF;
  transition: background 0.2s, color 0.2s;
  text-decoration: none;
}
.social-btn svg { width: 16px; height: 16px; }
.social-btn:hover { background: #4F46E5; color: #fff; }

/* Links */
.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}
.footer-col h5 {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #fff;
  margin: 0 0 16px;
}
.footer-col a, .footer-col p {
  display: block;
  font-size: 0.875rem;
  color: #9CA3AF;
  text-decoration: none;
  margin-bottom: 10px;
  line-height: 1.5;
  transition: color 0.2s;
}
.footer-col a:hover { color: #fff; }
.footer-addr { font-style: normal; margin: 0; }

/* Bottom */
.footer-bottom {
  border-top: 1px solid #1F2937;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.8rem;
  color: #6B7280;
}
.footer-legal { display: flex; gap: 20px; }
.footer-legal a { color: #6B7280; text-decoration: none; transition: color 0.2s; }
.footer-legal a:hover { color: #D1D5DB; }

@media (max-width: 900px) {
  .footer-main { grid-template-columns: 1fr; gap: 40px; }
  .footer-links { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .footer-links { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; align-items: flex-start; }
}
</style>
