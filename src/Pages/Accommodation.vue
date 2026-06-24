<!-- eslint-disable -->
<template>
  <div class="accommodation-page">

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-bar-inner">
        <div class="filter-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            v-model="searchCity"
            placeholder="Search by city or area..."
            class="filter-search-input"
            @keyup.enter="fetchRentals"
          />
        </div>
        <div class="filter-chips">
          <select v-model="filters.bedrooms" class="filter-chip">
            <option value="">Any beds</option>
            <option value="1">1 bed</option>
            <option value="2">2 beds</option>
            <option value="3">3 beds</option>
          </select>
          <div class="price-range">
            <input type="number" v-model.number="filters.minPrice" placeholder="Min £" class="filter-chip price-input" />
            <span class="price-sep">–</span>
            <input type="number" v-model.number="filters.maxPrice" placeholder="Max £" class="filter-chip price-input" />
          </div>
          <button @click="fetchRentals" class="search-apply-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div class="results-area">
      <!-- Result count -->
      <div v-if="!loading && !error && filteredRentals.length > 0" class="results-count">
        <span>{{ filteredRentals.length }} {{ filteredRentals.length === 1 ? 'property' : 'properties' }} found{{ searchCity ? ` in "${searchCity}"` : '' }}</span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-panel">
        <div class="spinner"></div>
        <p>Searching properties…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state-panel state-error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p>{{ error }}</p>
      </div>

      <!-- No results -->
      <div v-else-if="filteredRentals.length === 0" class="state-panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <h3>No properties found</h3>
        <p>Try a different location or adjust your filters.</p>
      </div>

      <!-- Grid -->
      <div v-else class="property-grid">
        <div
          class="property-card"
          v-for="property in paginatedRentals"
          :key="property.id"
          @click="$router.push(`/property/${property.offerid}`)"
        >
          <!-- Image -->
          <div class="card-image">
            <img
              v-if="property.photos.length"
              :src="getPhotoUrl(property.photos[property.currentIndex])"
              alt="Property photo"
            />
            <div v-else class="card-no-image">
              <svg viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <!-- Nav buttons -->
            <button v-if="property.photos.length > 1" @click.stop="prevPhoto(property.id)" class="img-nav img-nav--left">&#8249;</button>
            <button v-if="property.photos.length > 1" @click.stop="nextPhoto(property.id)" class="img-nav img-nav--right">&#8250;</button>
            <!-- Price badge -->
            <div class="price-badge">{{ property.formattedPrice }}</div>
          </div>

          <!-- Info -->
          <div class="card-info">
            <h3 class="card-title">{{ property.title }}</h3>
            <p class="card-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ property.neighbourhood }}
            </p>
            <div class="card-meta">
              <span class="meta-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 14h8"/><path d="M10 14v6"/></svg>
                {{ property.numberOfRooms }} bed{{ property.numberOfRooms !== 1 ? 's' : '' }}
              </span>
              <span class="meta-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                {{ property.numberOfBathrooms }} bath
              </span>
              <span class="meta-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {{ property.maxGuest }} guests
              </span>
            </div>
            <div class="card-footer">
              <span v-if="property.StartDate" class="avail-date">Available from {{ property.StartDate }}</span>
              <button class="view-btn" @click.stop="$router.push(`/property/${property.offerid}`)">View</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalFilteredPages > 1" class="pagination">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn page-btn--arrow">&#8249;</button>
        <button v-if="currentPage > 1" @click="goToPage(1)" class="page-btn">1</button>
        <span v-if="currentPage > 3" class="page-dots">…</span>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['page-btn', { active: page === currentPage }]"
        >{{ page }}</button>
        <span v-if="currentPage < totalFilteredPages - 2" class="page-dots">…</span>
        <button v-if="currentPage < totalFilteredPages" @click="goToPage(totalFilteredPages)" class="page-btn">{{ totalFilteredPages }}</button>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalFilteredPages" class="page-btn page-btn--arrow">&#8250;</button>
      </div>
    </div>

  </div>
</template>



<script>
import axios from "axios";

export default {
  name: "AppAccommodation",
  data() {
    return {
      searchCity: "",
      filters: {
        minPrice: null,
        maxPrice: null,
        radius: 0,
        bedrooms: "",
        toDate: null,
      },
      rentals: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      perPage: 8,
    };
  },
  computed: {
    filteredRentals() {
  return this.rentals.filter((rental) => {
    const price = parseFloat(rental.price); // Parse price to ensure numeric comparison
    const numberOfRooms = rental.numberOfRooms;

    return (
      (!this.filters.maxPrice || price <= this.filters.maxPrice) && 
    (!this.filters.minPrice || price >= this.filters.minPrice) &&
      // Ensure maxPrice is correctly applied
      (!this.filters.bedrooms || numberOfRooms === parseInt(this.filters.bedrooms) || numberOfRooms == null)
    );
  });
},
    totalFilteredPages() {
      return Math.ceil(this.filteredRentals.length / this.perPage);
    },
    paginatedRentals() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredRentals.slice(start, end);
    },
    visiblePages() {
      const totalPages = this.totalFilteredPages;
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(totalPages, this.currentPage + 2);

      let pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
  methods: {
    increaseGuests(propertyId) {
      const property = this.rentals.find((rental) => rental.id === propertyId);
      if (property) {
        property.guests++;
      }
    },
    decreaseGuests(propertyId) {
      const property = this.rentals.find((rental) => rental.id === propertyId);
      if (property && property.guests > 1) {
        property.guests--;
      }
    },
      async fetchRentals() {
  this.loading = true;
  let url = "/api/rentals";
  let params = {
    _page: this.currentPage,
    _limit: this.perPage,
  };

  // If searchCity is not empty, apply the search filter
  if (this.searchCity) {
    params.title = this.searchCity;
  }

  // Apply other filters only if they are not empty
  if (this.filters.radius) params.radius = this.filters.radius;
  if (this.filters.bedrooms) params.bedrooms = this.filters.bedrooms;
  if (this.filters.minPrice) params.minPrice = this.filters.minPrice;
  if (this.filters.maxPrice) params.maxPrice = this.filters.maxPrice;

  try {
    let responseData = [];
    try {
      const response = await axios.get(url, { params });
      responseData = Array.isArray(response.data) ? response.data : [];
    } catch (httpErr) {
      if (httpErr.response && httpErr.response.status === 404) {
        this.rentals = [];
        this.loading = false;
        return;
      }
      throw httpErr;
    }
    this.rentals = responseData.map((rental) => {
      const currencySymbols = {
        GBP: '£',
        USD: '$',
        EUR: '€',
      };

      const currencySymbol = currencySymbols[rental.currency] || rental.currency;
      const monthlyPrice = parseFloat(rental.price);
      //const weeklyPrice = monthlyPrice / 4;
      const formattedMonthlyPrice = new Intl.NumberFormat().format(monthlyPrice);
      //const formattedWeeklyPrice = new Intl.NumberFormat().format(weeklyPrice);

      return {
        id: rental.id || "N/A",
        title: rental.title || "No title",
        description: rental.description || "No description",
        price: rental.price || "N/A",
        currency: rental.currency || "N/A",
        neighbourhood: rental.neighbourhood ? JSON.parse(rental.neighbourhood).name : "Unknown",
        numberOfRooms: rental.number_of_rooms || "N/A",
        numberOfBathrooms: rental.number_of_bathrooms || "N/A",
        photos: (() => {
          try {
            if (!rental.photos) return [];
            if (Array.isArray(rental.photos)) return rental.photos;
            return JSON.parse(rental.photos);
          } catch { return []; }
        })(),
        currentIndex: 0,
        formattedPrice: `${currencySymbol}${formattedMonthlyPrice} /month `,
        maxGuest: rental.max_guests,
        StartDate: rental.available_date
          ? new Date(rental.available_date).toISOString().slice(0, 10)
          : "",
      guests: 1,
      offerid : rental.offerid
      };
    });
    this.totalPages = this.totalFilteredPages; // Update the total pages based on filtered results
  } catch (error) {
    this.error = "Error fetching rentals.";
  } finally {
    this.loading = false;
  }
    },

    getPhotoUrl(hash) {
      return hash ? `https://cdn-static.staging-uniplaces.com/property-photos/${hash}/large.jpg` : "";
    },

    prevPhoto(propertyId) {
      const property = this.rentals.find((p) => p.id === propertyId);
      if (property) {
        property.currentIndex = (property.currentIndex - 1 + property.photos.length) % property.photos.length;
      }
    },

    nextPhoto(propertyId) {
      const property = this.rentals.find((p) => p.id === propertyId);
      if (property) {
        property.currentIndex = (property.currentIndex + 1) % property.photos.length;
      }
    },


    goToPage(page) {
      this.currentPage = page;
      this.fetchRentals(); // Re-fetch rentals for the selected page
    },
    
},

  
  
  mounted() {
    this.fetchRentals();
  },
};
</script>

<style scoped>
.accommodation-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: #F9FAFB;
  min-height: 100vh;
}

/* ── FILTER BAR ── */
.filter-bar {
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
  padding: 16px 24px;
  position: sticky;
  top: 68px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.filter-bar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.filter-search {
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F9FAFB;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  padding: 8px 14px;
}
.filter-search svg { width: 18px; height: 18px; color: #9CA3AF; flex-shrink: 0; }
.filter-search-input {
  flex: 1; border: none; outline: none;
  font-size: 0.9rem; color: #111827; background: transparent;
}
.filter-search-input::placeholder { color: #9CA3AF; }
.filter-chips { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.filter-chip {
  padding: 8px 12px;
  border: 1.5px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  background: #F9FAFB;
  cursor: pointer;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.filter-chip:focus { border-color: #4F46E5; }
.price-range { display: flex; align-items: center; gap: 6px; }
.price-input { width: 90px; text-align: center; }
.price-sep { color: #9CA3AF; font-size: 0.9rem; }
.search-apply-btn {
  display: flex; align-items: center; gap: 6px;
  background: #4F46E5; color: #fff;
  border: none; border-radius: 8px;
  padding: 9px 18px; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: background 0.2s; font-family: inherit;
  white-space: nowrap;
}
.search-apply-btn svg { width: 16px; height: 16px; }
.search-apply-btn:hover { background: #3730A3; }

/* ── RESULTS AREA ── */
.results-area {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px 60px;
}
.results-count {
  font-size: 0.9rem; color: #6B7280; margin-bottom: 20px; font-weight: 500;
}

/* ── STATE PANELS ── */
.state-panel {
  text-align: center;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.state-panel svg { width: 56px; height: 56px; }
.state-panel h3 { font-size: 1.2rem; font-weight: 700; color: #374151; margin: 0; }
.state-panel p { color: #9CA3AF; margin: 0; }
.state-error svg { stroke: #EF4444; }

/* Spinner */
.spinner {
  width: 40px; height: 40px;
  border: 3px solid #E5E7EB;
  border-top-color: #4F46E5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── PROPERTY GRID ── */
.property-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* ── PROPERTY CARD ── */
.property-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.property-card:hover {
  box-shadow: 0 8px 32px rgba(79,70,229,0.12);
  transform: translateY(-4px);
}

/* Card Image */
.card-image {
  position: relative;
  height: 210px;
  background: #F3F4F6;
  overflow: hidden;
}
.card-image img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.4s;
}
.property-card:hover .card-image img { transform: scale(1.04); }
.card-no-image {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}
.card-no-image svg { width: 48px; height: 48px; }

/* Nav buttons */
.img-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.9);
  border: none; border-radius: 50%;
  width: 32px; height: 32px;
  font-size: 1.2rem; line-height: 1;
  cursor: pointer; color: #374151;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: background 0.2s;
}
.img-nav:hover { background: #fff; }
.img-nav--left { left: 10px; }
.img-nav--right { right: 10px; }

/* Price badge */
.price-badge {
  position: absolute; bottom: 10px; left: 10px;
  background: rgba(17,24,39,0.82);
  color: #fff;
  font-size: 0.875rem; font-weight: 700;
  padding: 4px 10px; border-radius: 6px;
  backdrop-filter: blur(4px);
}

/* Card Info */
.card-info { padding: 16px 18px 18px; }
.card-title {
  font-size: 1rem; font-weight: 700; color: #111827;
  margin: 0 0 6px; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.card-location {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.82rem; color: #6B7280; margin: 0 0 12px;
}
.card-location svg { width: 13px; height: 13px; flex-shrink: 0; }
.card-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.meta-chip {
  display: flex; align-items: center; gap: 4px;
  background: #F3F4F6;
  color: #374151;
  font-size: 0.78rem; font-weight: 500;
  padding: 4px 10px; border-radius: 20px;
}
.meta-chip svg { width: 12px; height: 12px; }
.card-footer {
  display: flex; align-items: center; justify-content: space-between;
  border-top: 1px solid #F3F4F6; padding-top: 12px;
}
.avail-date { font-size: 0.78rem; color: #9CA3AF; }
.view-btn {
  background: #4F46E5; color: #fff;
  border: none; border-radius: 8px;
  padding: 7px 18px; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: background 0.2s; font-family: inherit;
}
.view-btn:hover { background: #3730A3; }

/* ── PAGINATION ── */
.pagination {
  display: flex; align-items: center; justify-content: center;
  gap: 6px; margin-top: 40px; flex-wrap: wrap;
}
.page-btn {
  min-width: 40px; height: 40px;
  border: 1.5px solid #E5E7EB;
  border-radius: 8px;
  background: #fff; color: #374151;
  font-size: 0.9rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
  font-family: inherit;
}
.page-btn:hover:not(:disabled) { border-color: #4F46E5; color: #4F46E5; }
.page-btn.active { background: #4F46E5; border-color: #4F46E5; color: #fff; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn--arrow { font-size: 1.2rem; }
.page-dots { color: #9CA3AF; padding: 0 4px; }

@media (max-width: 768px) {
  .filter-bar { top: 0; }
  .property-grid { grid-template-columns: 1fr; }
  .price-range { display: none; }
}
</style>