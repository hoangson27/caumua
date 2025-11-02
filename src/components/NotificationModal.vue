<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info' // success, warning, error, info
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

const closeNotification = () => {
  isVisible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

const getIcon = () => {
  switch (props.type) {
    case 'success': return '✅'
    case 'warning': return '⚠️'
    case 'error': return '❌'
    default: return 'ℹ️'
  }
}

const getTitle = () => {
  switch (props.type) {
    case 'success': return 'Thành Công!'
    case 'warning': return 'Cảnh Báo!'
    case 'error': return 'Lỗi!'
    default: return 'Thông Báo'
  }
}

// Auto close after 5 seconds for success notifications
if (props.type === 'success') {
  setTimeout(() => {
    closeNotification()
  }, 5000)
}
</script>

<template>
  <div class="notification-overlay" @click="closeNotification">
    <div 
      class="notification-modal" 
      :class="[type, { visible: isVisible }]"
      @click.stop
    >
      <div class="notification-header">
        <div class="notification-icon">{{ getIcon() }}</div>
        <h3 class="notification-title">{{ getTitle() }}</h3>
        <button @click="closeNotification" class="close-btn">&times;</button>
      </div>
      
      <div class="notification-content">
        <div class="message-container">
          <p class="notification-message">{{ message }}</p>
        </div>
        
        <!-- Decorative elements for success -->
        <div v-if="type === 'success'" class="celebration-effects">
          <div class="sparkle" v-for="i in 6" :key="i"></div>
          <div class="confetti" v-for="i in 8" :key="i"></div>
        </div>
      </div>
      
      <div class="notification-footer">
        <div class="traditional-border"></div>
        <button @click="closeNotification" class="acknowledge-btn">
          <span v-if="type === 'success'">🙏 Tạ Ơn</span>
          <span v-else>Đã Hiểu</span>
        </button>
      </div>
      
      <!-- Progress bar for auto-close -->
      <div v-if="type === 'success'" class="auto-close-progress">
        <div class="progress-bar"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(3px);
  padding: 1rem;
}

.notification-modal {
  background: linear-gradient(135deg, #f7f4ed 0%, #faf8f3 100%);
  border: 3px solid #8b4513;
  border-radius: 15px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transform: scale(0.8) translateY(-50px);
  opacity: 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.notification-modal.visible {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.notification-modal:before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border: 2px solid #cd853f;
  border-radius: 10px;
  pointer-events: none;
}

/* Type-specific styling */
.notification-modal.success {
  border-color: #27ae60;
  background: linear-gradient(135deg, #d5f4e6 0%, #e8f8f1 100%);
}

.notification-modal.success:before {
  border-color: #2ecc71;
}

.notification-modal.warning {
  border-color: #f39c12;
  background: linear-gradient(135deg, #fef3e2 0%, #fcf3cf 100%);
}

.notification-modal.warning:before {
  border-color: #e67e22;
}

.notification-modal.error {
  border-color: #e74c3c;
  background: linear-gradient(135deg, #fdeaea 0%, #fadbd8 100%);
}

.notification-modal.error:before {
  border-color: #c0392b;
}

.notification-header {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 2px solid #cd853f;
  position: relative;
  z-index: 2;
}

.notification-modal.success .notification-header {
  border-color: #2ecc71;
}

.notification-modal.warning .notification-header {
  border-color: #e67e22;
}

.notification-modal.error .notification-header {
  border-color: #c0392b;
}

.notification-icon {
  font-size: 2rem;
  margin-right: 1rem;
  animation: icon-bounce 0.6s ease-out;
}

@keyframes icon-bounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.notification-title {
  flex: 1;
  margin: 0;
  font-size: 1.3rem;
  font-weight: bold;
  color: #8b4513;
}

.notification-modal.success .notification-title {
  color: #27ae60;
}

.notification-modal.warning .notification-title {
  color: #e67e22;
}

.notification-modal.error .notification-title {
  color: #c0392b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #8b4513;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: all 0.3s ease;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: rgba(139, 69, 19, 0.1);
  transform: rotate(90deg);
}

.notification-content {
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.message-container {
  text-align: center;
  margin-bottom: 1rem;
}

.notification-message {
  color: #654321;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

.celebration-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #f1c40f;
  border-radius: 50%;
  animation: sparkle-float 3s ease-in-out infinite;
}

.sparkle:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
.sparkle:nth-child(2) { top: 30%; right: 25%; animation-delay: 0.5s; }
.sparkle:nth-child(3) { top: 60%; left: 15%; animation-delay: 1s; }
.sparkle:nth-child(4) { top: 70%; right: 20%; animation-delay: 1.5s; }
.sparkle:nth-child(5) { top: 40%; left: 50%; animation-delay: 2s; }
.sparkle:nth-child(6) { top: 80%; right: 40%; animation-delay: 2.5s; }

@keyframes sparkle-float {
  0%, 100% { 
    opacity: 0; 
    transform: translateY(0) scale(0);
  }
  50% { 
    opacity: 1; 
    transform: translateY(-20px) scale(1);
  }
}

.confetti {
  position: absolute;
  width: 6px;
  height: 12px;
  border-radius: 2px;
  animation: confetti-fall 4s ease-in-out infinite;
}

.confetti:nth-child(odd) { background: #e74c3c; }
.confetti:nth-child(even) { background: #3498db; }

.confetti:nth-child(7) { left: 10%; animation-delay: 0s; }
.confetti:nth-child(8) { left: 20%; animation-delay: 0.3s; }
.confetti:nth-child(9) { left: 40%; animation-delay: 0.6s; }
.confetti:nth-child(10) { left: 60%; animation-delay: 0.9s; }
.confetti:nth-child(11) { left: 70%; animation-delay: 1.2s; }
.confetti:nth-child(12) { left: 85%; animation-delay: 1.5s; }
.confetti:nth-child(13) { left: 30%; animation-delay: 1.8s; }
.confetti:nth-child(14) { left: 90%; animation-delay: 2.1s; }

@keyframes confetti-fall {
  0% { 
    opacity: 1;
    transform: translateY(-100px) rotate(0deg);
  }
  100% { 
    opacity: 0;
    transform: translateY(200px) rotate(360deg);
  }
}

.notification-footer {
  padding: 1rem 2rem 2rem;
  text-align: center;
  position: relative;
  z-index: 2;
}

.traditional-border {
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #cd853f, transparent);
  margin: 0 auto 1rem;
  border-radius: 2px;
}

.notification-modal.success .traditional-border {
  background: linear-gradient(90deg, transparent, #2ecc71, transparent);
}

.notification-modal.warning .traditional-border {
  background: linear-gradient(90deg, transparent, #e67e22, transparent);
}

.notification-modal.error .traditional-border {
  background: linear-gradient(90deg, transparent, #c0392b, transparent);
}

.acknowledge-btn {
  padding: 0.8rem 2rem;
  border: 2px solid #8b4513;
  border-radius: 25px;
  background: rgba(139, 69, 19, 0.1);
  color: #654321;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.acknowledge-btn:hover {
  background: rgba(139, 69, 19, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.2);
}

.notification-modal.success .acknowledge-btn {
  border-color: #27ae60;
  background: rgba(46, 204, 113, 0.1);
  color: #27ae60;
}

.notification-modal.success .acknowledge-btn:hover {
  background: rgba(46, 204, 113, 0.2);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.2);
}

.auto-close-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(139, 69, 19, 0.2);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #27ae60;
  width: 0;
  animation: progress-fill 5s linear forwards;
}

@keyframes progress-fill {
  from { width: 0; }
  to { width: 100%; }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .notification-overlay {
    padding: 0.5rem;
  }
  
  .notification-header {
    padding: 1rem 1.5rem 0.8rem;
  }
  
  .notification-icon {
    font-size: 1.8rem;
    margin-right: 0.8rem;
  }
  
  .notification-title {
    font-size: 1.1rem;
  }
  
  .notification-content {
    padding: 1.5rem;
  }
  
  .notification-message {
    font-size: 1rem;
  }
  
  .notification-footer {
    padding: 1rem 1.5rem 1.5rem;
  }
  
  .acknowledge-btn {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>