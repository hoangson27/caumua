<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TraditionalAltar from './components/TraditionalAltar.vue'
import WeatherDisplay from './components/WeatherDisplay.vue'
import RitualModal from './components/RitualModal.vue'
import NotificationModal from './components/NotificationModal.vue'
import soundManager from './utils/SoundManager.js'

const currentWeather = ref('heavy-rain') // heavy-rain, light-rain, drizzle, cloudy, clear
const rainIntensity = ref(100)
const isRitualActive = ref(false)
const ritualProgress = ref(0)
const showRitualModal = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success') // success, warning, info
const soundEnabled = ref(true)

const raindrops = ref([])
const cloudsPosition = ref(0)
const windDirection = ref(1)

// Tạo hiệu ứng mưa thực tế
const createRealisticRaindrop = () => {
  const intensity = rainIntensity.value / 100
  return {
    id: Math.random(),
    left: Math.random() * 100,
    size: Math.random() * 2 + 1,
    speed: (Math.random() * 1 + intensity) * 2,
    opacity: Math.random() * 0.6 + 0.4,
    angle: Math.random() * 15 - 7.5 // Góc rơi tự nhiên
  }
}

const addRaindrops = () => {
  if (currentWeather.value.includes('rain') || currentWeather.value === 'drizzle') {
    const dropCount = currentWeather.value === 'heavy-rain' ? 5 : 
                     currentWeather.value === 'light-rain' ? 2 : 1
    
    for (let i = 0; i < dropCount; i++) {
      raindrops.value.push(createRealisticRaindrop())
    }
    
    if (raindrops.value.length > 150) {
      raindrops.value.splice(0, 50)
    }
  }
}

// Hiệu ứng gió và mây
const updateClouds = () => {
  cloudsPosition.value += windDirection.value * 0.1
  if (cloudsPosition.value > 100) {
    cloudsPosition.value = -20
  }
}

let weatherInterval = null
let cloudInterval = null

onMounted(() => {
  weatherInterval = setInterval(addRaindrops, 50)
  cloudInterval = setInterval(updateClouds, 100)
})

onUnmounted(() => {
  if (weatherInterval) clearInterval(weatherInterval)
  if (cloudInterval) clearInterval(cloudInterval)
})

const startRitual = () => {
  soundManager.resumeAudioContext()
  if (soundEnabled.value) {
    soundManager.playRitualAmbient()
  }
  showRitualModal.value = true
}

const closeRitualModal = () => {
  showRitualModal.value = false
}

const beginRitualProcess = () => {
  isRitualActive.value = true
  ritualProgress.value = 0
  showRitualModal.value = false
  
  if (soundEnabled.value) {
    soundManager.playTempleBell()
  }
  
  const progressInterval = setInterval(() => {
    ritualProgress.value += 0.5
    
    // Thay đổi thời tiết dần dần với âm thanh
    if (ritualProgress.value > 20 && currentWeather.value === 'heavy-rain') {
      currentWeather.value = 'light-rain'
      rainIntensity.value = 60
      if (soundEnabled.value) soundManager.playRainSound()
    } else if (ritualProgress.value > 40 && currentWeather.value === 'light-rain') {
      currentWeather.value = 'drizzle'
      rainIntensity.value = 30
    } else if (ritualProgress.value > 60 && currentWeather.value === 'drizzle') {
      currentWeather.value = 'cloudy'
      rainIntensity.value = 0
      raindrops.value = []
      if (soundEnabled.value) soundManager.playWindChimes()
    } else if (ritualProgress.value > 80 && currentWeather.value === 'cloudy') {
      currentWeather.value = 'clear'
    }
    
    if (ritualProgress.value >= 100) {
      clearInterval(progressInterval)
      isRitualActive.value = false
      showSuccessNotification()
    }
  }, 100)
}

const showSuccessNotification = () => {
  notificationMessage.value = 'Nghi thức đã hoàn thành thành công! Trời đã tạnh mưa và quang đãng.'
  notificationType.value = 'success'
  showNotification.value = true
  
  if (soundEnabled.value) {
    soundManager.playNotification('success')
  }
}

// Xử lý altar actions với âm thanh
const handleAltarAction = (action) => {
  if (!soundEnabled.value) return
  
  switch (action.type) {
    case 'candle':
      soundManager.playFireSound()
      break
    case 'incense':
      soundManager.playIncenseSound()
      break
    case 'water':
      soundManager.playWaterSound()
      break
    case 'bell':
      soundManager.playTempleBell()
      break
    case 'scroll':
      soundManager.playScrollSound()
      break
    case 'flowers':
      soundManager.playWindChimes()
      break
  }
}

// Toggle âm thanh
const toggleSound = () => {
  soundEnabled.value = soundManager.toggleSound()
  
  if (soundEnabled.value) {
    soundManager.playNotification('info')
  }
}

const closeNotification = () => {
  showNotification.value = false
}

const resetWeather = () => {
  currentWeather.value = 'heavy-rain'
  rainIntensity.value = 100
  ritualProgress.value = 0
  isRitualActive.value = false
  raindrops.value = []
}
</script>

<template>
  <div class="ancient-app" :class="currentWeather">
    <!-- Background elements -->
    <div class="sky-background">
      <!-- Clouds -->
      <div class="clouds-layer">
        <div 
          class="cloud large-cloud"
          :style="{ transform: `translateX(${cloudsPosition}px)` }"
        ></div>
        <div 
          class="cloud medium-cloud"
          :style="{ transform: `translateX(${cloudsPosition * 0.7}px)` }"
        ></div>
        <div 
          class="cloud small-cloud"
          :style="{ transform: `translateX(${cloudsPosition * 1.3}px)` }"
        ></div>
      </div>
      
      <!-- Rain effect -->
      <div class="rain-layer">
        <div 
          v-for="drop in raindrops"
          :key="drop.id"
          class="realistic-raindrop"
          :style="{
            left: drop.left + '%',
            opacity: drop.opacity,
            width: drop.size + 'px',
            height: (drop.size * 15) + 'px',
            animationDuration: drop.speed + 's',
            transform: `rotate(${drop.angle}deg)`
          }"
        ></div>
      </div>

      <!-- Lightning effect -->
      <div 
        v-if="currentWeather === 'heavy-rain' && Math.random() > 0.98"
        class="lightning-flash"
      ></div>
    </div>

    <!-- Main content with traditional scroll -->
    <div class="scroll-container">
      <div class="parchment-paper">
        <!-- Header with traditional design -->
        <header class="traditional-header">
          <div class="header-ornament top-ornament"></div>
          <h1 class="ancient-title">
            <span class="title-ornament">◈</span>
            Nghi Thức Cầu Tạnh Mưa
            <span class="title-ornament">◈</span>
          </h1>
          <p class="ancient-subtitle">
            Theo truyền thống cổ xưa - Cầu mong trời quang mây tạnh
          </p>
          <div class="header-ornament bottom-ornament"></div>
        </header>

        <!-- Weather display -->
        <WeatherDisplay 
          :currentWeather="currentWeather"
          :rainIntensity="rainIntensity"
          :ritualProgress="ritualProgress"
          :isRitualActive="isRitualActive"
        />

        <!-- Traditional altar -->
        <TraditionalAltar 
          :isRitualActive="isRitualActive"
          :currentWeather="currentWeather"
          @start-ritual="startRitual"
          @reset-weather="resetWeather"
          @altar-action="handleAltarAction"
        />

        <!-- Action buttons section -->
        <div class="action-buttons-section">
          <div class="special-actions">
            <button 
              @click="toggleSound"
              class="sound-toggle-btn"
              :class="{ active: soundEnabled }"
            >
              <span class="btn-icon">{{ soundEnabled ? '🔊' : '🔇' }}</span>
              <span class="btn-text">{{ soundEnabled ? 'Tắt Âm Thanh' : 'Bật Âm Thanh' }}</span>
            </button>
          </div>
        </div>

        <!-- Footer with traditional pattern -->
        <footer class="traditional-footer">
          <div class="footer-ornament"></div>
          <p class="footer-text">
            "Thiên thời, địa lợi, nhân hòa - Tam tài hợp nhất"
          </p>
        </footer>
      </div>
    </div>

    <!-- Modals -->
    <RitualModal 
      v-if="showRitualModal"
      @close="closeRitualModal"
      @begin-ritual="beginRitualProcess"
    />

    <NotificationModal
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="closeNotification"
    />
  </div>
</template>

<style scoped>
.ancient-app {
  min-height: 100vh;
  position: relative;
  transition: all 2s ease;
  font-family: 'Times New Roman', serif;
  overflow-x: hidden;
}

/* Weather backgrounds */
.ancient-app.heavy-rain {
  background: linear-gradient(to bottom, #2c3e50 0%, #34495e 30%, #2c3e50 100%);
}

.ancient-app.light-rain {
  background: linear-gradient(to bottom, #34495e 0%, #5d6d7e 30%, #85929e 100%);
}

.ancient-app.drizzle {
  background: linear-gradient(to bottom, #5d6d7e 0%, #85929e 30%, #aeb6bf 100%);
}

.ancient-app.cloudy {
  background: linear-gradient(to bottom, #85929e 0%, #aeb6bf 30%, #d5dbdb 100%);
}

.ancient-app.clear {
  background: linear-gradient(to bottom, #f39c12 0%, #f7dc6f 30%, #fcf3cf 100%);
}

.sky-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.clouds-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
  opacity: 0.6;
}

.cloud:before,
.cloud:after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
}

.large-cloud {
  width: 200px;
  height: 60px;
  top: 15%;
  left: -250px;
  animation: cloud-drift 30s linear infinite;
}

.large-cloud:before {
  width: 80px;
  height: 80px;
  top: -40px;
  left: 20px;
}

.large-cloud:after {
  width: 120px;
  height: 120px;
  top: -60px;
  right: 20px;
}

.medium-cloud {
  width: 150px;
  height: 40px;
  top: 25%;
  left: -200px;
  animation: cloud-drift 25s linear infinite;
}

.medium-cloud:before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 15px;
}

.medium-cloud:after {
  width: 90px;
  height: 90px;
  top: -45px;
  right: 15px;
}

.small-cloud {
  width: 100px;
  height: 30px;
  top: 35%;
  left: -150px;
  animation: cloud-drift 20s linear infinite;
}

.small-cloud:before {
  width: 40px;
  height: 40px;
  top: -20px;
  left: 10px;
}

.small-cloud:after {
  width: 60px;
  height: 60px;
  top: -30px;
  right: 10px;
}

@keyframes cloud-drift {
  from { transform: translateX(0); }
  to { transform: translateX(calc(100vw + 300px)); }
}

.rain-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.realistic-raindrop {
  position: absolute;
  top: -20px;
  background: linear-gradient(to bottom, 
    rgba(174, 214, 241, 0.8) 0%,
    rgba(174, 214, 241, 0.6) 50%,
    rgba(174, 214, 241, 0.2) 100%);
  border-radius: 0 0 50% 50%;
  animation: realistic-rain-fall linear infinite;
}

@keyframes realistic-rain-fall {
  to {
    transform: translateY(calc(100vh + 50px));
  }
}

.lightning-flash {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  animation: lightning 0.2s ease-out;
}

@keyframes lightning {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.scroll-container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.parchment-paper {
  max-width: 800px;
  width: 100%;
  background: linear-gradient(45deg, #f4f1e8 0%, #f7f4ed 50%, #faf8f3 100%);
  border: 3px solid #8b4513;
  border-radius: 15px;
  box-shadow: 
    0 0 0 2px #cd853f,
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(139, 69, 19, 0.2);
  position: relative;
  overflow: hidden;
}

.parchment-paper:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(139, 69, 19, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(139, 69, 19, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(139, 69, 19, 0.03) 0%, transparent 30%);
  pointer-events: none;
}

.traditional-header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  border-bottom: 2px solid #cd853f;
  position: relative;
}

.header-ornament {
  height: 20px;
  background: linear-gradient(90deg, 
    transparent 0%,
    #cd853f 20%,
    #daa520 50%,
    #cd853f 80%,
    transparent 100%);
  margin: 1rem auto;
  position: relative;
}

.header-ornament:before,
.header-ornament:after {
  content: '❦';
  position: absolute;
  top: -8px;
  color: #8b4513;
  font-size: 1.2rem;
}

.header-ornament:before { left: -15px; }
.header-ornament:after { right: -15px; }

.ancient-title {
  font-size: clamp(2rem, 5vw, 3rem);
  color: #8b4513;
  text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.3);
  margin: 1rem 0;
  font-weight: bold;
  letter-spacing: 2px;
}

.title-ornament {
  color: #daa520;
  margin: 0 1rem;
  display: inline-block;
  animation: ornament-glow 3s ease-in-out infinite;
}

@keyframes ornament-glow {
  0%, 100% { text-shadow: 0 0 5px #daa520; }
  50% { text-shadow: 0 0 15px #daa520, 0 0 25px #daa520; }
}

.ancient-subtitle {
  font-size: 1.1rem;
  color: #654321;
  font-style: italic;
  margin-bottom: 1rem;
}

.traditional-footer {
  text-align: center;
  padding: 2rem;
  border-top: 2px solid #cd853f;
  margin-top: 2rem;
}

.footer-ornament {
  width: 100px;
  height: 20px;
  background: repeating-linear-gradient(
    90deg,
    #cd853f 0px,
    #cd853f 10px,
    transparent 10px,
    transparent 20px
  );
  margin: 0 auto 1rem;
}

.footer-text {
  color: #8b4513;
  font-style: italic;
  font-size: 0.9rem;
}

/* Action buttons styling */
.action-buttons-section {
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(139, 69, 19, 0.05);
  border: 2px solid #cd853f;
  border-radius: 15px;
  text-align: center;
}

.special-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.sound-toggle-btn {
  position: relative;
  padding: 1.2rem 2rem;
  border: 3px solid;
  border-radius: 15px;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Times New Roman', serif;
  font-weight: bold;
  text-align: center;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.sound-toggle-btn {
  border-color: #f59e0b;
  color: #92400e;
}

.sound-toggle-btn:hover {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
}

.sound-toggle-btn.active {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-color: #22c55e;
  color: #15803d;
}

.sound-toggle-btn .btn-icon {
  font-size: 1.5rem;
  animation: sound-wave 1.5s ease-in-out infinite;
}

@keyframes sound-wave {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.sound-toggle-btn .btn-text {
  font-size: 1rem;
  font-weight: bold;
}

/* Responsive design for action buttons */
@media (max-width: 768px) {
  .special-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .sound-toggle-btn {
    width: 100%;
    max-width: 300px;
    padding: 1rem 1.5rem;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .scroll-container {
    padding: 1rem 0.5rem;
  }
  
  .parchment-paper {
    margin: 0;
    border-radius: 10px;
  }
  
  .traditional-header {
    padding: 2rem 1rem 1rem;
  }
  
  .ancient-title {
    font-size: 1.8rem;
  }
  
  .title-ornament {
    margin: 0 0.5rem;
  }
}
</style>
