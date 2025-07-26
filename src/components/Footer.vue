<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <img src="/favicon.ico" alt="APA Insurance" class="footer-logo-img">
            <span class="footer-logo-text">APA Insurance</span>
          </div>
          <p class="footer-tagline">Your trusted healthcare insurance partner</p>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Contact Information</h4>
          <div class="contact-info">
            <div class="contact-item">
              <EnvelopeIcon class="contact-icon" />
              <span>info@apainsurance.com</span>
            </div>
            <div class="contact-item">
              <PhoneIcon class="contact-icon" />
              <span>+254 700 000 000</span>
            </div>
            <div class="contact-item">
              <MapPinIcon class="contact-icon" />
              <span>APA Centre, Nairobi, Kenya</span>
            </div>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Provider Support</h4>
          <div class="contact-info">
            <div class="contact-item">
              <BuildingOffice2Icon class="contact-icon" />
              <span>providers@apainsurance.com</span>
            </div>
            <div class="contact-item">
              <ClockIcon class="contact-icon" />
              <span>Mon - Fri: 8:00 AM - 6:00 PM</span>
            </div>
            <div class="contact-item">
              <ExclamationTriangleIcon class="contact-icon" />
              <span>24/7 Emergency Support</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} APA Insurance Company. All rights reserved.</p>
        <p class="footer-disclaimer">Provider Management Portal - Internal Use Only</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  BuildingOffice2Icon, 
  ClockIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 2rem 0 1rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.footer-logo-img {
  width: 32px;
  height: 32px;
}

.footer-logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.footer-tagline {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}

.footer-title {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #cbd5e1;
}

.contact-icon {
  width: 1.25rem;
  height: 1.25rem;
  text-align: center;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 1rem;
  text-align: center;
}

.footer-bottom p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #94a3b8;
}

.footer-disclaimer {
  font-weight: 500;
  color: #fbbf24 !important;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-section {
    text-align: center;
  }

  .footer-logo {
    justify-content: center;
  }
}
</style>
