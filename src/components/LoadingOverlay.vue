<template>
  <div v-if="visible" class="loading-overlay">
    <div class="loading-content">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <h3 class="loading-title">{{ title }}</h3>
      <p class="loading-message">{{ message }}</p>
      <div v-if="steps.length > 0" class="loading-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step-item"
          :class="{ 
            'completed': step.status === 'completed',
            'in-progress': step.status === 'in-progress',
            'pending': step.status === 'pending'
          }"
        >
          <div class="step-icon">
            <div v-if="step.status === 'completed'" class="check-icon">✓</div>
            <div v-else-if="step.status === 'in-progress'" class="progress-spinner"></div>
            <div v-else class="pending-dot"></div>
          </div>
          <span class="step-text">{{ step.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Processing...'
  },
  message: {
    type: String,
    default: 'Please wait while we process your request.'
  },
  steps: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.loading-spinner {
  margin-bottom: 1.5rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-title {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.loading-message {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.loading-steps {
  text-align: left;
  max-width: 300px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.step-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  background-color: #28a745;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.progress-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.pending-dot {
  width: 8px;
  height: 8px;
  background-color: #ccc;
  border-radius: 50%;
}

.step-text {
  font-size: 0.9rem;
  color: #333;
}

.step-item.completed .step-text {
  color: #28a745;
}

.step-item.in-progress .step-text {
  color: #007bff;
  font-weight: 500;
}

.step-item.pending .step-text {
  color: #999;
}
</style>