<!-- eslint-disable -->
<template>
  <div class="home">

    <!-- ── HERO ── -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Find your perfect home in the UK</h1>
        <p class="hero-sub">Search thousands of verified properties — rooms, flats & houses to rent</p>

        <!-- Search bar -->
        <div class="hero-search">
          <div class="search-bar">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Enter a city, postcode or area..."
              class="search-input"
              @keyup.enter="goSearch"
            />
            <select v-model="bedroomsFilter" class="search-select">
              <option value="">Any beds</option>
              <option value="1">1 bed</option>
              <option value="2">2 beds</option>
              <option value="3">3 beds</option>
            </select>
            <button @click="goSearch" class="search-btn">Search</button>
          </div>
        </div>

        <!-- Quick tags -->
        <div class="hero-tags">
          <span class="tag" @click="setTag('London')">London</span>
          <span class="tag" @click="setTag('Manchester')">Manchester</span>
          <span class="tag" @click="setTag('Birmingham')">Birmingham</span>
          <span class="tag" @click="setTag('Athens')">Athens</span>
          <span class="tag" @click="setTag('Aberdeen')">Aberdeen</span>
        </div>
      </div>
    </section>

    <!-- ── STATS STRIP ── -->
    <section class="stats-strip">
      <div class="stats-container">
        <div class="stat-item">
          <span class="stat-num">10,000+</span>
          <span class="stat-label">Active Listings</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">500+</span>
          <span class="stat-label">UK Cities Covered</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">98%</span>
          <span class="stat-label">Verified Properties</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">24h</span>
          <span class="stat-label">Support Response</span>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ── -->
    <section class="how-it-works">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Finding your home made simple</h2>
          <p class="section-sub">From search to move-in in three easy steps</p>
        </div>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-icon step-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div class="step-num">01</div>
            <h3 class="step-title">Search & Filter</h3>
            <p class="step-desc">Use our smart filters to narrow down by location, price, number of bedrooms, and more to find exactly what you need.</p>
          </div>
          <div class="step-card">
            <div class="step-icon step-icon--purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div class="step-num">02</div>
            <h3 class="step-title">View Properties</h3>
            <p class="step-desc">Browse detailed listings with photo galleries, floor plans, and neighbourhood info so you can choose with confidence.</p>
          </div>
          <div class="step-card">
            <div class="step-icon step-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div class="step-num">03</div>
            <h3 class="step-title">Book Your Stay</h3>
            <p class="step-desc">Check availability, pick your dates, and secure your property directly through NestHaven — no middlemen, no hassle.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── BROWSE BY TYPE ── -->
    <section class="browse-types">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Browse by property type</h2>
        </div>
        <div class="type-grid">
          <router-link to="/accommodation" class="type-card type-card--1">
            <div class="type-overlay"></div>
            <div class="type-content">
              <h3>Studio Flats</h3>
              <span>Perfect for solo living</span>
            </div>
          </router-link>
          <router-link to="/accommodation" class="type-card type-card--2">
            <div class="type-overlay"></div>
            <div class="type-content">
              <h3>Shared Houses</h3>
              <span>Bills often included</span>
            </div>
          </router-link>
          <router-link to="/accommodation" class="type-card type-card--3">
            <div class="type-overlay"></div>
            <div class="type-content">
              <h3>Private Rooms</h3>
              <span>From £400/month</span>
            </div>
          </router-link>
          <router-link to="/accommodation" class="type-card type-card--4">
            <div class="type-overlay"></div>
            <div class="type-content">
              <h3>Entire Homes</h3>
              <span>Family &amp; group options</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ── WHY NESTHAVEN ── -->
    <section class="why-us">
      <div class="section-container why-grid">
        <div class="why-text">
          <span class="why-tag">Why NestHaven?</span>
          <h2 class="why-title">The UK's most trusted accommodation platform</h2>
          <p class="why-desc">We work directly with landlords and verified agents to bring you genuine, up-to-date listings. No fake ads, no surprise fees.</p>
          <ul class="why-list">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              All listings individually verified
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Transparent pricing — no hidden fees
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              24-hour customer support
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Secure, direct booking system
            </li>
          </ul>
          <router-link to="/accommodation" class="why-btn">Browse All Properties</router-link>
        </div>
        <div class="why-image">
          <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80" alt="Modern UK living room" />
          <div class="why-badge">
            <svg viewBox="0 0 24 24" fill="#4F46E5" width="20" height="20"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <div>
              <span class="badge-num">4.9/5</span>
              <span class="badge-label">Trusted by 50k+ renters</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA BANNER ── -->
    <section class="cta-banner">
      <div class="cta-content">
        <h2>Ready to find your next home?</h2>
        <p>Join thousands of happy renters who found their perfect property on NestHaven</p>
        <div class="cta-btns">
          <router-link to="/accommodation" class="cta-primary">Search Properties</router-link>
          <router-link to="/contact" class="cta-secondary">List Your Property</router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'AppHome',
  data() {
    return {
      searchQuery: '',
      bedroomsFilter: '',
    };
  },
  methods: {
    goSearch() {
      const query = {};
      if (this.searchQuery) query.city = this.searchQuery;
      if (this.bedroomsFilter) query.bedrooms = this.bedroomsFilter;
      this.$router.push({ path: '/accommodation', query });
    },
    setTag(city) {
      this.searchQuery = city;
      this.goSearch();
    },
  },
};
</script>

<style scoped>
.home { font-family: 'Inter', 'Segoe UI', sans-serif; }

/* ── HERO ── */
.hero {
  position: relative;
  min-height: 540px;
  background: url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(17,24,39,0.75) 0%, rgba(79,70,229,0.55) 100%);
}
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 60px 24px;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
}
.hero-title {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin: 0 0 12px;
  letter-spacing: -0.5px;
}
.hero-sub {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.85);
  margin: 0 0 32px;
}

/* Search bar */
.hero-search { width: 100%; }
.search-bar {
  background: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 6px 6px 6px 16px;
  gap: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
.search-icon { width: 20px; height: 20px; color: #9CA3AF; flex-shrink: 0; }
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #111827;
  background: transparent;
  min-width: 0;
}
.search-input::placeholder { color: #9CA3AF; }
.search-select {
  border: none;
  outline: none;
  font-size: 0.9rem;
  color: #374151;
  background: #F9FAFB;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
}
.search-btn {
  background: #4F46E5;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.search-btn:hover { background: #3730A3; }

/* Quick tags */
.hero-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}
.tag {
  background: rgba(255,255,255,0.18);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.35);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
  backdrop-filter: blur(4px);
}
.tag:hover { background: rgba(255,255,255,0.3); }

/* ── STATS ── */
.stats-strip {
  background: #4F46E5;
  padding: 20px 24px;
}
.stats-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
}
.stat-item { text-align: center; }
.stat-num { display: block; font-size: 1.6rem; font-weight: 800; color: #fff; }
.stat-label { font-size: 0.8rem; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.5px; }
.stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.25); }

/* ── SHARED LAYOUT ── */
.section-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-header { text-align: center; margin-bottom: 48px; }
.section-title { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #111827; margin: 0 0 10px; }
.section-sub { font-size: 1.05rem; color: #6B7280; margin: 0; }

/* ── HOW IT WORKS ── */
.how-it-works { padding: 80px 0; background: #F9FAFB; }
.steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.step-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #E5E7EB;
  position: relative;
  transition: box-shadow 0.2s, transform 0.2s;
}
.step-card:hover { box-shadow: 0 8px 32px rgba(79,70,229,0.12); transform: translateY(-4px); }
.step-icon {
  width: 52px; height: 52px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.step-icon svg { width: 24px; height: 24px; }
.step-icon--blue { background: #EEF2FF; }
.step-icon--blue svg { stroke: #4F46E5; }
.step-icon--purple { background: #F5F3FF; }
.step-icon--purple svg { stroke: #7C3AED; }
.step-icon--green { background: #ECFDF5; }
.step-icon--green svg { stroke: #059669; }
.step-num { font-size: 0.8rem; font-weight: 700; color: #D1D5DB; letter-spacing: 1px; margin-bottom: 8px; }
.step-title { font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0 0 10px; }
.step-desc { font-size: 0.9rem; color: #6B7280; line-height: 1.65; margin: 0; }

/* ── BROWSE BY TYPE ── */
.browse-types { padding: 80px 0; }
.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 220px);
  gap: 16px;
}
.type-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  display: block;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s;
}
.type-card:hover { transform: scale(1.02); }
.type-card--1 { background-image: url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'); }
.type-card--2 { background-image: url('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80'); }
.type-card--3 { background-image: url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'); }
.type-card--4 { background-image: url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'); }
.type-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%);
}
.type-content {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 20px;
}
.type-content h3 { font-size: 1.2rem; font-weight: 700; color: #fff; margin: 0 0 4px; }
.type-content span { font-size: 0.85rem; color: rgba(255,255,255,0.8); }

/* ── WHY US ── */
.why-us { padding: 80px 0; background: #F9FAFB; }
.why-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.why-tag {
  display: inline-block;
  background: #EEF2FF;
  color: #4F46E5;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
}
.why-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: #111827; margin: 0 0 14px; }
.why-desc { font-size: 0.95rem; color: #6B7280; line-height: 1.7; margin: 0 0 24px; }
.why-list { list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 12px; }
.why-list li {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.95rem; color: #374151; font-weight: 500;
}
.why-list svg { width: 18px; height: 18px; flex-shrink: 0; }
.why-btn {
  display: inline-block;
  background: #4F46E5;
  color: #fff;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.why-btn:hover { background: #3730A3; }
.why-image { position: relative; }
.why-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.why-badge {
  position: absolute;
  bottom: -20px; left: -20px;
  background: #fff;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border: 1px solid #E5E7EB;
}
.badge-num { display: block; font-size: 1.2rem; font-weight: 800; color: #111827; }
.badge-label { font-size: 0.75rem; color: #6B7280; }

/* ── CTA BANNER ── */
.cta-banner {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  padding: 72px 24px;
  text-align: center;
}
.cta-content { max-width: 620px; margin: 0 auto; }
.cta-content h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #fff; margin: 0 0 12px; }
.cta-content p { color: rgba(255,255,255,0.82); font-size: 1.05rem; margin: 0 0 32px; }
.cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.cta-primary {
  background: #fff;
  color: #4F46E5;
  padding: 13px 28px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: opacity 0.2s;
}
.cta-primary:hover { opacity: 0.92; }
.cta-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255,255,255,0.6);
  padding: 13px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: border-color 0.2s;
}
.cta-secondary:hover { border-color: #fff; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .steps-grid { grid-template-columns: 1fr; }
  .type-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
  .type-card { height: 180px; }
  .why-grid { grid-template-columns: 1fr; gap: 32px; }
  .why-image img { height: 260px; }
  .why-badge { left: 12px; bottom: 12px; }
  .stat-divider { display: none; }
  .search-bar { flex-wrap: wrap; }
  .search-select { flex: 1; }
}
</style>
