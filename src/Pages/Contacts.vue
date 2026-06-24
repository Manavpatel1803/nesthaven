<template>
  <div class="contact-page">

    <!-- Page Header -->
    <div class="contact-header">
      <div class="contact-header-inner">
        <h1>Get in touch</h1>
        <p>Have a question about a property or want to list with us? We're here to help.</p>
      </div>
    </div>

    <div class="contact-body">

      <!-- Left: Info Panel -->
      <aside class="contact-info">
        <div class="info-card">
          <div class="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <h4>Phone</h4>
            <p>+44 (0) 20 1234 5678</p>
            <span>Mon–Fri, 9am–6pm</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div>
            <h4>Email</h4>
            <p>admin@nesthaven.co.uk</p>
            <span>We reply within 24 hours</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <h4>Address</h4>
            <p>123 High Street, London</p>
            <span>EC1A 1BB, United Kingdom</span>
          </div>
        </div>

        <!-- Enquiry Types -->
        <div class="enquiry-types">
          <h4>What are you looking for?</h4>
          <div class="enquiry-grid">
            <div
              v-for="t in enquiryTypes"
              :key="t.value"
              :class="['enquiry-type', { active: selectedEnquiry === t.value }]"
              @click="selectedEnquiry = t.value"
            >
              <span class="enquiry-icon">{{ t.icon }}</span>
              <span>{{ t.label }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right: Form -->
      <main class="contact-form-wrapper">
        <div v-if="formSubmitted" class="success-panel">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
          </div>
          <h3>Message sent!</h3>
          <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
          <button @click="formSubmitted = false" class="send-again-btn">Send another message</button>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="contact-form" novalidate>
          <h2 class="form-title">Send us a message</h2>
          <input type="hidden" name="access_key" :value="apiKey" />
          <input type="checkbox" name="botcheck" style="display:none;" />

          <div class="form-row">
            <div class="form-group">
              <label>First Name <span class="req">*</span></label>
              <input type="text" v-model="formData.name" placeholder="John" required class="form-input" />
            </div>
            <div class="form-group">
              <label>Last Name <span class="req">*</span></label>
              <input type="text" v-model="formData.lastName" placeholder="Smith" required class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email Address <span class="req">*</span></label>
              <input type="email" v-model="formData.email" placeholder="john@example.com" required class="form-input" />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" v-model="formData.phone" placeholder="+44 7700 900000" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label>Subject</label>
            <select v-model="formData.subject" class="form-input form-select">
              <option value="">Select a topic...</option>
              <option>Property Enquiry</option>
              <option>List My Property</option>
              <option>Booking Help</option>
              <option>Report an Issue</option>
              <option>General Question</option>
            </select>
          </div>

          <div class="form-group">
            <label>Your Message <span class="req">*</span></label>
            <textarea v-model="formData.message" rows="5" placeholder="Tell us how we can help you..." required class="form-input"></textarea>
          </div>

          <div v-if="submitError" class="error-msg">{{ submitError }}</div>

          <button type="submit" class="submit-btn" :disabled="submitting">
            <svg v-if="!submitting" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            <span>{{ submitting ? 'Sending…' : 'Send Message' }}</span>
          </button>
        </form>
      </main>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AppContacts",
  data() {
    return {
      apiKey: process.env.VUE_APP_WEB3FORMS_API_KEY,
      formSubmitted: false,
      submitting: false,
      submitError: null,
      selectedEnquiry: '',
      enquiryTypes: [
        { value: 'rent', label: 'Find to Rent', icon: '🏠' },
        { value: 'list', label: 'List Property', icon: '📋' },
        { value: 'book', label: 'Booking Help', icon: '📅' },
        { value: 'other', label: 'Other', icon: '💬' },
      ],
      formData: {
        name: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      },
    };
  },
  methods: {
    async handleSubmit() {
      this.submitting = true;
      this.submitError = null;
      try {
        const response = await axios.post("https://api.web3forms.com/submit", {
          access_key: this.apiKey,
          ...this.formData,
        });
        if (response.status === 200) {
          this.formSubmitted = true;
        }
      } catch (error) {
        this.submitError = "Something went wrong. Please try again or email us directly.";
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.contact-page { font-family: 'Inter', 'Segoe UI', sans-serif; background: #F9FAFB; min-height: 100vh; }

/* Header */
.contact-header {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  padding: 60px 24px;
  text-align: center;
}
.contact-header-inner { max-width: 600px; margin: 0 auto; }
.contact-header h1 { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; color: #fff; margin: 0 0 10px; }
.contact-header p { color: rgba(255,255,255,0.82); font-size: 1.05rem; margin: 0; }

/* Body layout */
.contact-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 32px;
  align-items: start;
}

/* Info Panel */
.contact-info { display: flex; flex-direction: column; gap: 16px; }
.info-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #E5E7EB;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.info-icon {
  width: 42px; height: 42px; flex-shrink: 0;
  background: #EEF2FF;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.info-icon svg { width: 20px; height: 20px; stroke: #4F46E5; }
.info-card h4 { font-size: 0.85rem; font-weight: 700; color: #374151; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; }
.info-card p { font-size: 0.95rem; color: #111827; margin: 0 0 2px; font-weight: 500; }
.info-card span { font-size: 0.8rem; color: #9CA3AF; }

/* Enquiry types */
.enquiry-types {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #E5E7EB;
  padding: 20px;
}
.enquiry-types h4 { font-size: 0.9rem; font-weight: 700; color: #374151; margin: 0 0 14px; }
.enquiry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.enquiry-type {
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  padding: 10px 8px;
  cursor: pointer;
  text-align: center;
  font-size: 0.82rem;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
}
.enquiry-type:hover { border-color: #4F46E5; background: #EEF2FF; }
.enquiry-type.active { border-color: #4F46E5; background: #EEF2FF; color: #4F46E5; }
.enquiry-icon { font-size: 1.3rem; }

/* Form */
.contact-form-wrapper {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.form-title { font-size: 1.5rem; font-weight: 800; color: #111827; margin: 0 0 28px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
.form-group label { font-size: 0.875rem; font-weight: 600; color: #374151; }
.req { color: #EF4444; }
.form-input {
  padding: 11px 14px;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #111827;
  background: #F9FAFB;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
}
.form-input:focus { border-color: #4F46E5; background: #fff; outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
.form-select { appearance: none; cursor: pointer; }
textarea.form-input { resize: vertical; min-height: 120px; }

.error-msg { color: #EF4444; font-size: 0.875rem; margin-bottom: 14px; background: #FEF2F2; padding: 10px 14px; border-radius: 8px; }

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #4F46E5;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s, opacity 0.2s;
  font-family: inherit;
}
.submit-btn svg { width: 18px; height: 18px; }
.submit-btn:hover:not(:disabled) { background: #3730A3; }
.submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

/* Success */
.success-panel { text-align: center; padding: 48px 24px; }
.success-icon { width: 72px; height: 72px; background: #ECFDF5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.success-icon svg { width: 36px; height: 36px; }
.success-panel h3 { font-size: 1.6rem; font-weight: 800; color: #111827; margin: 0 0 8px; }
.success-panel p { color: #6B7280; margin: 0 0 24px; }
.send-again-btn {
  background: #EEF2FF;
  color: #4F46E5;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

/* Responsive */
@media (max-width: 900px) {
  .contact-body { grid-template-columns: 1fr; }
  .contact-form-wrapper { padding: 28px 20px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
