<template>
  <div class="jobs-container">
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        @input="fetchJobs" 
        placeholder="Search for jobs..." 
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else>
      <div v-if="jobs.length === 0" class="no-jobs">No jobs found.</div>

      <!-- Job Listings Grid -->
      <div class="job-grid">
        <div v-for="job in jobs" :key="job.id" class="job-listing">
          <h2>{{ job.title }}</h2>
          <p><strong>Company:</strong> {{ job.company }}</p>
          <p><strong>Location:</strong> {{ job.location }}</p>
          <p><strong>Description:</strong></p>
          <ul class="job-description">
            <li v-for="(desc, index) in getJobDescription(job.description)" :key="index">{{ desc }}</li>
          </ul>
          <button class="apply-button" @click="applyNow(job.url)">Apply Now</button>
        </div>
      </div>
    </div>

    <!-- Pagination with Dynamic Page Numbers -->
    <div v-if="jobs.length > 0 && totalPages > 1" class="pagination">
      <button v-if="currentPage > 1" @click="goToPage(1)" class="pagination-btn">
        1
      </button>

      <span v-if="currentPage > 3" class="dots">...</span>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="{ 'active': page === currentPage }"
        class="pagination-btn"
      >
        {{ page }}
      </button>

      <span v-if="currentPage < totalPages - 2" class="dots">...</span>

      <button v-if="currentPage < totalPages" @click="goToPage(totalPages)" class="pagination-btn">
        {{ totalPages }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AppJobs',
  data() {
    return {
      jobs: [],
      loading: false,
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      perPage: 8, 
    };
  },
  computed: {
    visiblePages() {
      const pageNumbers = [];
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, this.currentPage + 2);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      return pageNumbers;
    }
  },
  methods: {
    async fetchJobs() {
      this.loading = true;
      try {
        const response = await axios.get(`/api/jobs`, {
          params: {
            search: this.searchQuery, 
            _page: this.currentPage,
            _limit: this.perPage,
          }
        });

        this.jobs = Array.isArray(response.data) ? response.data : [];
        const totalCount = parseInt(response.headers['x-total-count'], 10) || 0;
        this.totalPages = Math.max(1, Math.ceil(totalCount / this.perPage));
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error("Error fetching jobs:", error);
      }
    },
    getJobDescription(description) {
      if (!description) {
        return ['No description available.'];
      }
      const sentences = description.split(".").filter((s) => s.trim() !== "");
      return sentences.length > 0 ? sentences.slice(0, 3) : ['No description available.'];
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchJobs();
    },
    applyNow(joburl) {
      const applyUrl = `${joburl}`;
      window.location.href = applyUrl;
    }
  },
  watch: {
    searchQuery: 'fetchJobs',
    currentPage: 'fetchJobs',
  },
  mounted() {
    this.fetchJobs();
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
  color: #333;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Jobs Container */
.jobs-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.title {
  text-align: center;
  color: #333;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.search-input:focus {
  border-color: #4c38f9;
  outline: none;
}

.loading {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.no-jobs {
  text-align: center;
  color: #888;
}

/* Job Grid Layout */
.job-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 equal columns */
  gap: 20px;
  margin-top: 20px;
}

/* Single Job Listing Card */
.job-listing {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: 1px solid #dddddd;
}

.job-listing h2 {
  color: #000000; /* Set the title to black */
  font-size: 22px;
  font-weight: 600;
}

.job-description {
  list-style-type: disc;
  padding-left: 20px;
  margin: 10px 0;
  color: #555555;
}

.apply-button {
  background-color: #4c38f9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 15px;
}

.apply-button:hover {
  background-color: #3a2bbf;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination-btn {
  padding: 10px;
  margin: 0 5px;
  border: 1px solid #ddd;
  cursor: pointer;
}

.pagination-btn.active {
  background-color: #4c38f9;
  color: white;
}

.pagination-btn:hover {
  background-color: #ddd;
}

.dots {
  padding: 10px;
  display: inline-block;
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .job-grid {
    grid-template-columns: 1fr; /* 1 column layout for smaller screens */
  }

  .search-input {
    width: 100%; /* Full width for the search bar on smaller screens */
  }

  .jobs-container {
    padding: 10px; /* Reduce padding on smaller screens */
  }

  .pagination-btn {
    font-size: 12px;
    padding: 6px 10px;
  }
}

@media screen and (max-width: 480px) {
  .job-listing {
    padding: 15px; /* Reduce card padding */
  }

  .apply-button {
    font-size: 14px; /* Adjust button font size for smaller screens */
  }

  .pagination-number {
    font-size: 14px; /* Adjust pagination font size */
    padding: 6px 10px; /* Smaller buttons */
  }
}
</style>
