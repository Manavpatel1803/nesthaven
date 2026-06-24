<template>
  <div class="about-page">

    <!-- Hero -->
    <section class="about-hero">
      <div class="about-hero-inner">
        <span class="about-tag">About NestHaven</span>
        <h1>We're on a mission to make renting <em>better</em></h1>
        <p>NestHaven connects renters with quality, verified properties across the UK — making the search simple, transparent, and stress-free.</p>
      </div>
      <div class="about-hero-img">
        <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80" alt="Modern UK housing" />
      </div>
    </section>

    <!-- Values -->
    <section class="about-values">
      <div class="av-container">
        <h2>What we stand for</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="val-icon" style="background:#EEF2FF">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Trust & Safety</h3>
            <p>Every property is individually reviewed. We don't publish listings we haven't verified — your safety comes first.</p>
          </div>
          <div class="value-card">
            <div class="val-icon" style="background:#ECFDF5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3>Transparency</h3>
            <p>No hidden fees, no bait-and-switch listings. The price you see is the price you pay — always.</p>
          </div>
          <div class="value-card">
            <div class="val-icon" style="background:#FFF7ED">
              <svg viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3>Community</h3>
            <p>We're building a platform that works for both renters and landlords — fair, accessible, and people-first.</p>
          </div>
          <div class="value-card">
            <div class="val-icon" style="background:#F5F3FF">
              <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h3>Innovation</h3>
            <p>We're constantly improving our search tools, booking flow, and recommendations to save you time and effort.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Story -->
    <section class="about-story">
      <div class="story-container">
        <div class="story-text">
          <span class="about-tag">Our Story</span>
          <h2>Built by renters, for renters</h2>
          <p>NestHaven was founded after our team experienced the pain of searching for accommodation in the UK — hours lost scrolling through outdated listings, unreliable landlords, and surprise fees at the end.</p>
          <p>We built the platform we wished existed: a clean, fast, honest way to find a verified home — with real photos, real prices, and real availability.</p>
          <p>Today NestHaven lists thousands of properties across hundreds of UK cities, helping people find a place they're proud to call home.</p>
        </div>
        <div class="story-images">
          <img class="story-img-main" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80" alt="Modern home" />
          <img class="story-img-small" src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&q=80" alt="Interior" />
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="about-stats">
      <div class="stats-inner">
        <div class="astat">
          <span class="astat-num">10,000+</span>
          <span class="astat-label">Active Properties</span>
        </div>
        <div class="astat">
          <span class="astat-num">500+</span>
          <span class="astat-label">UK Cities</span>
        </div>
        <div class="astat">
          <span class="astat-num">50,000+</span>
          <span class="astat-label">Happy Renters</span>
        </div>
        <div class="astat">
          <span class="astat-num">4.9★</span>
          <span class="astat-label">Average Rating</span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="about-cta">
      <h2>Ready to find your next home?</h2>
      <p>Browse thousands of verified properties across the UK right now.</p>
      <div class="about-cta-btns">
        <router-link to="/accommodation" class="acta-primary">Search Properties</router-link>
        <router-link to="/contact" class="acta-secondary">Contact Us</router-link>
      </div>
    </section>

  </div>
</template>

<script>
export default { name: 'AppAbout' }
</script>

<style scoped>
.about-page { font-family: 'Inter', 'Segoe UI', sans-serif; }

/* Hero */
.about-hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: 72px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.about-tag {
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
.about-hero-inner h1 {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
  margin: 0 0 16px;
}
.about-hero-inner h1 em { font-style: normal; color: #4F46E5; }
.about-hero-inner p { font-size: 1.05rem; color: #6B7280; line-height: 1.7; margin: 0; }
.about-hero-img img {
  width: 100%;
  height: 380px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.13);
}

/* Values */
.about-values { background: #F9FAFB; padding: 80px 0; }
.av-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.av-container h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #111827; text-align: center; margin: 0 0 48px; }
.values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.value-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #E5E7EB;
  transition: box-shadow 0.2s, transform 0.2s;
}
.value-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-4px); }
.val-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.val-icon svg { width: 22px; height: 22px; }
.value-card h3 { font-size: 1rem; font-weight: 700; color: #111827; margin: 0 0 8px; }
.value-card p { font-size: 0.875rem; color: #6B7280; line-height: 1.65; margin: 0; }

/* Story */
.about-story { padding: 80px 0; }
.story-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.story-text h2 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: #111827; margin: 0 0 20px; }
.story-text p { font-size: 0.95rem; color: #6B7280; line-height: 1.75; margin: 0 0 16px; }
.story-text p:last-child { margin: 0; }
.story-images { position: relative; height: 380px; }
.story-img-main {
  width: 78%;
  height: 320px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}
.story-img-small {
  position: absolute;
  bottom: 0; right: 0;
  width: 48%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  border: 4px solid #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* Stats */
.about-stats {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  padding: 56px 24px;
}
.stats-inner {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  text-align: center;
}
.astat-num { display: block; font-size: 2.2rem; font-weight: 800; color: #fff; }
.astat-label { font-size: 0.85rem; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; display: block; }

/* CTA */
.about-cta {
  text-align: center;
  padding: 80px 24px;
  background: #F9FAFB;
}
.about-cta h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #111827; margin: 0 0 12px; }
.about-cta p { color: #6B7280; font-size: 1.05rem; margin: 0 0 32px; }
.about-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.acta-primary {
  background: #4F46E5; color: #fff;
  padding: 13px 28px; border-radius: 10px;
  font-weight: 700; font-size: 0.95rem;
  text-decoration: none; transition: background 0.2s;
}
.acta-primary:hover { background: #3730A3; }
.acta-secondary {
  background: #fff; color: #4F46E5;
  border: 1.5px solid #E5E7EB;
  padding: 13px 28px; border-radius: 10px;
  font-weight: 600; font-size: 0.95rem;
  text-decoration: none; transition: border-color 0.2s;
}
.acta-secondary:hover { border-color: #4F46E5; }

@media (max-width: 900px) {
  .about-hero, .story-container { grid-template-columns: 1fr; gap: 32px; }
  .about-hero-img img { height: 240px; }
  .values-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-inner { grid-template-columns: repeat(2, 1fr); }
  .story-images { height: 260px; }
  .story-img-main { width: 100%; height: 260px; position: relative; }
  .story-img-small { display: none; }
}
@media (max-width: 480px) {
  .values-grid { grid-template-columns: 1fr; }
  .stats-inner { grid-template-columns: repeat(2, 1fr); }
}
</style>
