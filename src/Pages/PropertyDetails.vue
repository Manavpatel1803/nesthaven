<!-- eslint-disable -->
<template>
  <!-- Loading and Error States -->
  <div v-if="loading" class="loading">Loading...</div>
  <div v-if="error" class="error">{{ error }}</div>
  
  <!-- Property Card -->
  <div v-else class="property-card">
    <!-- Google One Tap Sign-In -->
    <div v-if="!userEmail" id="g_id_onload"
    :data-client_id=googleClientId
    data-callback="handleCredentialResponse"
    data-auto_prompt="false">
</div>

<!-- Google Sign-In Button -->
<!-- <div v-if="!userEmail" class="google-signin-container">
    <div class="g_id_signin" data-type="standard"></div>
</div> -->

<!-- Navbar with Profile Info (Shows after user is logged in) -->

    <div class="property-images">
      <div class="photo-carousel" v-if="property && property.photos?.length">
        <button @click="prevPhoto" class="slider-btn left" :disabled="!property.photos.length">&lt;</button>
        <img :src="getPhotoUrl(property.photos[currentPhotoIndex])" alt="Property photo" class="property-photo" @click="openGallery(currentPhotoIndex)" />
        <button @click="nextPhoto" class="slider-btn right" :disabled="!property.photos.length">&gt;</button>
      </div>
    </div>
    <!-- Property Details -->
    <div class="property-details">
      <div class="property-info-list">
        <div v-if="property?.neighbourhood">🏘️ {{ property?.neighbourhood }} | 🛏️ {{ property?.numberOfRooms }} Rooms | 🚿 {{ property?.numberOfBathrooms }} Bathrooms</div>
        </div>
      <h3 class="property-title">{{ property?.title }}</h3>

      <p class="property-price">{{ property?.formattedPrice }}</p>
      <!-- Guest Selector -->
      <div class="guest-selector">
        <label>Guests:</label>
        <div class="guest-controls">
          <button @click="decreaseGuests" :disabled="guests <= 1">-</button>
          <span>{{ guests }}</span>
          <button @click="increaseGuests" :disabled="guests >= property?.maxGuests">+</button>
        </div>
        <p v-if="validationErrors.guests" class="error-message">{{ validationErrors.guests }}</p>
      </div>

      <!-- Date Range Selection -->
      <div class="date-selector">
        <label>Available Dates:</label>
        <div class="date-range-container">
          <input type="date" v-model="startDate" :min="minDate" />
          <span> to </span>
          <input type="date" v-model="endDate" :min="startDate || minDate" />
        </div>
        <p v-if="validationErrors.dates" class="error-message">{{ validationErrors.dates }}</p>
      </div>
     
      <!-- Book Now Button -->
      <button class="contact-btn" @click="checkAvailability()" v-if="!availabilityData && !errorMessage">
        View Availability
      </button>
      <p v-if="loading" class="loading-message">Please wait while we check availability...</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button v-if="errorMessage" class="contact-btn" @click="$router.go(-1)">
  View Similar Accomodations
</button>
      <p v-if="errorMessageaccomodation" class="error-message">{{ errorMessageaccomodation }}</p>

    </div>

  
    <div v-if="availabilityData" class="booking-card">
  <h3 class="section-title">Your Booking Details</h3>
  
  <div class="booking-info">
    <div class="booking-dates">
      <div class="date-box">
        <p class="date-label">Move In</p>
        <p class="date-value">{{ startDate || 'N/A' }}</p>
      </div>
      <div class="date-box">
        <p class="date-label">Move Out</p>
        <p class="date-value">{{ endDate || 'N/A' }}</p>
      </div>
    </div>
    
    <div class="price-details">
      <p><strong>Admin Fee:</strong> €{{ availabilityData.admin_fee?.value?.amount / 100 || 'N/A' }}</p>
      <p><strong>Deposit:</strong> €{{ availabilityData.deposit?.value?.amount / 100 || 'N/A' }}</p>
      <p class="total-amount"><strong>Total:</strong> €{{ availabilityData.first_payment?.total?.amount / 100 || 'N/A' }}</p>
    </div>
  </div>
  
  <div :class="{ 'loading-overlay': isLoading }">
    <button class="confirm-btn" @click="openBookingLink()" :disabled="isLoading">
      {{ isLoading ? "Please wait..." : "Confirm Booking" }}
    </button>
  </div>
</div>




  <!-- Gallery Modal -->
  <div v-if="galleryOpen" class="gallery-modal" @click="closeGallery">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="closeGallery">&times;</button>
      <img :src="getPhotoUrl(property.photos[currentPhotoIndex])" alt="Full-size photo" class="modal-photo" />
      <button @click="prevPhoto" class="slider-btn left" :disabled="currentPhotoIndex === 0">&lt;</button>
      <button @click="nextPhoto" class="slider-btn right" :disabled="currentPhotoIndex === property.photos.length - 1">&gt;</button>
    </div>
  </div>
  </div>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      property: null,
      loading: false,
      error: null,
      activeSection: null,
      galleryOpen: false,
      currentPhotoIndex: 0,
      guests: 1,
      endDate: "",
      validationErrors: {},
      minDate: new Date().toISOString().split("T")[0],
      availabilityData: null,
      errorMessage: null,
      dropdownOpen: false,
      isLoading: false,


      
    };
  },
  created() {
    this.fetchRentalDetails();
    this.fetchAccommodationDetails();
  },
  methods: {
    // Toggle dropdown visibility
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    

    async fetchRentalDetails() {
      this.loading = true;
      try {
        const response = await axios.get(`/api/rentals/offerid?offerid=${this.$route.params.offerid}`);
        const rental = response.data[0] || {};
        const currencySymbols = { GBP: "£", USD: "$", EUR: "€" };
        const currencySymbol = currencySymbols[rental.currency] || rental.currency;
        const monthlyPrice = parseFloat(rental.price);
        //const weeklyPrice = monthlyPrice / 4;
        const formattedMonthlyPrice = new Intl.NumberFormat().format(monthlyPrice);
        //const formattedWeeklyPrice = new Intl.NumberFormat().format(weeklyPrice / rental.number_of_rooms);

        this.property = {
          id: rental.id || "N/A",
          title: rental.title || "No title",
          description: rental.description || "No description",
          price: rental.price || "N/A",
          photos: Array.isArray(rental.photos) ? rental.photos : [],
          neighbourhood: rental.neighbourhood ? JSON.parse(rental.neighbourhood).name : "Unknown",
          numberOfRooms: rental.number_of_rooms || "N/A",
          formattedPrice: `${currencySymbol}${formattedMonthlyPrice} /month`,
          numberOfBathrooms: rental.number_of_bathrooms || "N/A",
          contractType: rental.contract_type || "N/A",
          billsIncluded: rental.bills_included || false,
          area: rental.area || 0,
          maxGuests: rental.max_guests,
          startDate: rental.available_date,
        };
      } catch (error) {
        console.error("Error fetching rental details:", error);
        this.error = "Error fetching rental details.";
      } finally {
        this.loading = false;
      }
    },
    async fetchAccommodationDetails() {
    try {
        const response = await fetch(`/api/rentals/getAccommodation/offerid?offerid=${this.$route.params.offerid}`);
        const data = await response.json();

        // Extracting specific details
        const accommodationOffer = data.accommodation_offer || {};
        const title = accommodationOffer.title?.find(t => t.locale_code === "en_GB")?.text || "No title available";
        const depositAmount = accommodationOffer.contract?.deposit?.value?.amount || 0;
        const depositCurrency = accommodationOffer.contract?.deposit?.value?.currency_code || "N/A";
        const minNights = accommodationOffer.requisites?.conditions?.minimum_nights || "N/A";
        const maxGuests = accommodationOffer.requisites?.conditions?.max_guests || "N/A";
        const billsIncluded = {
            water: accommodationOffer.costs?.bills?.water?.included || false,
            electricity: accommodationOffer.costs?.bills?.electricity?.included || false,
            gas: accommodationOffer.costs?.bills?.gas?.included || false,
            internet: accommodationOffer.costs?.bills?.internet?.included || false
        };
        console.log("Accomodation Details" ,accommodationOffer)
        console.log("Title:", title);
        console.log("Deposit:", depositAmount, depositCurrency);
        console.log("Min Nights:", minNights);
        console.log("Max Guests:", maxGuests);
        console.log("Bills Included:", billsIncluded);

    } catch  {
        console.log("Error fetching data:");
    }
},

// Call function with an example offer ID


    getPhotoUrl(hash) {
      return hash ? `https://cdn-static.staging-uniplaces.com/property-photos/${hash}/large.jpg` : "";
    },
    openGallery(index) {
      this.galleryOpen = true;
      this.currentPhotoIndex = index;
    },
    closeGallery() {
      this.galleryOpen = false;
    },
    prevPhoto() {
      if (this.property && this.property.photos.length) {
        this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.property.photos.length) % this.property.photos.length;
      }
    },
    nextPhoto() {
      if (this.property && this.property.photos.length) {
        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.property.photos.length;
      }
    },
    increaseGuests() {
      if (this.guests < this.property.maxGuests) {
        this.guests++;
      }
    },
    decreaseGuests() {
      if (this.guests > 1) {
        this.guests--;
      }
    },
    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
    checkUserLoggedIn() {
      const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
},
openBookingLink(){
      window.location.href = this.availabilityData.checkout_url;
    },

    async checkAvailability() {
      this.loading = true;
      try {
        const payload = {
          offer_id: Number(this.$route.params.offerid),
          move_in_out: {
            start: `${this.startDate} 12:00:00`,
            end: `${this.endDate} 12:00:00`
          },
          guests: Number(this.guests)
        };

        const response = await axios.post("/api/calculate-pricing", payload, {
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "x-api-key": process.env.UNIPLACES_API_KEY
          }
        });
        if (response.data) {
      this.availabilityData = { ...response.data };
      console.log(this.availabilityData) // Spread operator to ensure we copy the object
      this.errorMessage = null; 
      this.errorMessageaccomodation = null;// Clear any previous error
    } else {
      throw new Error("Invalid response from API");
    }
      } catch (error) {
        const responseMessage = error.response?.data?.message || "";
        if (responseMessage.includes("is no longer available")) {
          this.errorMessage = "Sorry, this accommodation is no longer available";
        }

        const match = responseMessage.match(/minimum stay with (\d+) days/);
        if (match) {
          const days = match[1];
          this.errorMessageaccomodation= `This accommodation requires a minimum stay of ${days} days.`;
        }
        //console.log(this.errorMessage);
      }
      finally {
    this.loading = false;
  }
    }
  }
</script>

  
  <style scoped>
  .error-message {
  color: red;
  font-size: 0.9rem;
}
/* Global Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f9f9f9;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}

/* Main Container */
.property-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
}

/* Property Card */
.property-card {
  display: flex;
  flex-direction: row;
  width: 100%;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Property Images */
.property-images {
    padding-top: 10px;
    width: 50%;
    position: relative;
    padding-left: 10px;
}

.property-photo {
    width: 100%;
    height: 500px;  /* Fixed height for the image */
    object-fit: cover;  /* Ensures the image maintains aspect ratio */
    border-radius: 15px 0 0 15px;
    transition: transform 0.3s ease;
}


.property-photo:hover {
  transform: scale(1.05);
}

.slider-btn {
  position: absolute;
  top: 80%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 1.5rem;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  z-index: 10;
}

@media (max-width: 768px) {
  .slider-btn  {
    top: 50%;
    border-radius: 0%;
  }
}

.left {
  left: 10px;
}

.right {
  right: 10px;
}

.slider-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* Property Details */
.property-details {
  width: 50%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.property-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  
}

.property-price {
  font-size: 2rem;
  color: #4c38f9;
}

.property-description {
  font-size: 1.1rem;
  color: #555;
}

.property-info-list {
  font-size: 1rem;
  color: #666;
}

.property-info-list li {
  margin-bottom: 10px;
}

.guest-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.guest-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.guest-controls button {
  font-size: 1.2rem;
  padding: 5px 10px;
  background: #4c38f9;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.guest-controls button:hover {
  background: #3a28c5;
}

.guest-controls span {
  font-size: 1.2rem;
  font-weight: bold;
}

.date-selector {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.date-range-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-range-container input {
  font-size: 1rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border 0.3s ease;
}

.date-range-container input:focus {
  border-color: #4c38f9;
  outline: none;
}

/* Details Sections */
.details-sections {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.details-toggle {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #f9f9f9;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.details-toggle:hover {
  background: #4c38f9;
  color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.details-toggle h4 {
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.details-toggle p {
  font-size: 1rem;
  margin-top: 5px;
}

/* Book Now Button */
.contact-btn {
  background: #4c38f9;
  color: white;
  padding: 15px 20px;
  font-size: 1.2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.contact-btn:hover {
  background: #3a28c5;
  transform: scale(1.05);
}

/* Gallery Modal */
/* Fullscreen Modal */
.gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px; /* Ensures content is not flush against edges */
}

/* Modal Content */
.modal-content {
  position: relative;
  width: 90%;
  max-width: 800px; /* Prevents excessive width */
  max-height: 80vh; /* Ensures it fits within the screen */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Image Scaling */
.modal-photo {
  width: 100%;
  height: auto;
  max-height: 70vh; /* Ensures it doesn't overflow the screen */
  object-fit: contain;
  border-radius: 8px;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #4c38f9;
  color: white;
  border: none;
  font-size: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  padding: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn:hover {
  background: #3a28c5;
}

/* Slider Buttons */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  transition: background 0.3s ease-in-out;
}

.slider-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.left {
  left: 10px;
}

.right {
  right: 10px;
}

/* Disabled State */
.slider-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
    max-height: 70vh;
  }

  .modal-photo {
    max-height: 60vh;
  }

  .slider-btn {
    font-size: 1.5rem;
    padding: 8px;
  }

  .close-btn {
    font-size: 1.2rem;
    width: 35px;
    height: 35px;
  }
}


/* Responsive Design */
@media (max-width: 768px) {
  .property-card {
    flex-direction: column;
  }

  .property-images,
  .property-details {
    width: 100%;
  }

  .property-photo {
    border-radius: 15px 15px 0 0;
  }

  .guest-controls button,
  .guest-controls span {
    font-size: 1rem;
  }

  .date-range-container input {
    font-size: 0.9rem;
  }

  .contact-btn {
    font-size: 1rem;
    padding: 10px 15px;
  }
  .error {
  color: red;
  font-weight: bold;
}
.availability-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  margin-top: 20px;
}

.availability-title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.availability-info p {
  font-size: 16px;
  margin: 5px 0;
}


/* Loading and Error Messages */
.loading,
.error {
  text-align: center;
  font-size: 18px;
  color: red;
  margin-top: 20px;
}
.rotate-180 {
  transform: rotate(180deg);
}







.navbar {
  display: flex;
  align-items: center;
}

.profile-pic {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.dropdown {
  position: relative;
  cursor: pointer;
  margin-left: 10px;
}

.dropdown-menu {
  position: absolute;
  top: 25px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  min-width: 150px;
}

.dropdown-menu button {
  background-color: red;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
}
.loading-message {
  font-size: 1.2rem;
  color: #007bff;
  font-weight: bold;
}

}
.booking-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  width: 90%;
  max-width: 600px;
  transition: all 0.3s ease-in-out;
}

/* Section Title */
.section-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}

/* Booking Info Section */
.booking-info {
  border-top: 1px solid #ddd;
  padding-top: 15px;
}

.booking-dates {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;
}

.date-box {
  background: #f8f8f8;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  flex: 1;
  min-width: 140px;
}

.date-label {
  font-size: 12px;
  color: #666;
}

.date-value {
  font-size: 16px;
  font-weight: bold;
}

/* Price Details */
.price-details {
  margin-top: 10px;
}

.price-details p {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 5px;
}

.total-amount {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* Confirm Button Styles */
.confirm-btn {
  width: 100%;
  background-color: #4c38f9;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease-in-out;
  text-align: center;
}

/* Hover Effect for Confirm Button */
.confirm-btn:hover {
  background-color: #3728d8;
}

/* Disable State for Confirm Button */
.confirm-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* Mobile Styles - For Screens Up to 768px */
@media (max-width: 768px) {
  .booking-card {
    width: 90%;
    max-width: 600px;
    padding: 15px;
    margin: 20px auto;
  }

  .booking-dates {
    flex-direction: column;
  }

  .date-box {
    min-width: 140px;
    margin-bottom: 10px;
  }

  .confirm-btn {
    font-size: 14px;
    padding: 10px;
  }
}

/* Desktop Styles - For Screens Above 768px */
@media (min-width: 769px) {
  .booking-card {
    width: 70%;  /* Decreased width for larger screens */
    max-width: 700px;  /* Adjusted max-width */
    padding: 25px;
    margin: 30px auto;
    background-color: #f8f8f8;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  .booking-dates {
    justify-content: space-between;
  }

  .date-box {
    min-width: 180px;
  }

  .confirm-btn {
    font-size: 18px;
    padding: 15px;
  }
}
.property-sections {
  width: 100%;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-link {
  background: none;
  color: #007BFF;
  padding: 0;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 18px;
  cursor: pointer;
  display: inline;
  margin-bottom: 5px;
}

.section-link:hover {
  text-decoration: underline;
}

.section {
  margin-bottom: 20px;
}

</style>
