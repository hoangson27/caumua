<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentWeather: String,
  rainIntensity: Number,
  ritualProgress: Number,
  isRitualActive: Boolean
})

const weatherDescription = computed(() => {
  switch (props.currentWeather) {
    case 'heavy-rain':
      return {
        title: 'Mưa Lớn',
        description: 'Trời đang đổ mưa như trút nước, cần nghi thức mạnh mẽ',
        icon: '🌧️',
        intensity: 'Rất mạnh'
      }
    case 'light-rain':
      return {
        title: 'Mưa Nhỏ',
        description: 'Mưa đang nhỏ dần, nghi thức bắt đầu có hiệu quả',
        icon: '🌦️',
        intensity: 'Trung bình'
      }
    case 'drizzle':
      return {
        title: 'Mưa Phùn',
        description: 'Chỉ còn mưa phùn, sắp tạnh hoàn toàn',
        icon: '🌦️',
        intensity: 'Yếu'
      }
    case 'cloudy':
      return {
        title: 'Có Mây',
        description: 'Mây đang tan dần, nắng sắp xuất hiện',
        icon: '☁️',
        intensity: 'Không mưa'
      }
    case 'clear':
      return {
        title: 'Quang Đãng',
        description: 'Trời đã hoàn toàn tạnh mưa và quang đãng',
        icon: '☀️',
        intensity: 'Nắng đẹp'
      }
    default:
      return {
        title: 'Không xác định',
        description: 'Đang quan sát thời tiết...',
        icon: '🌤️',
        intensity: '---'
      }
  }
})

const getProgressText = () => {
  if (!props.isRitualActive) return ''
  
  if (props.ritualProgress < 25) return 'Đang tập trung tâm thần...'
  if (props.ritualProgress < 50) return 'Cầu nguyện với các vị thần...'
  if (props.ritualProgress < 75) return 'Năng lượng đang tác động...'
  if (props.ritualProgress < 100) return 'Sắp hoàn thành nghi thức...'
  return 'Hoàn thành!'
}
</script>

<template>
  <section class="weather-display">
    <div class="weather-scroll">
      <h2 class="section-title">
        <span class="ornamental-border"></span>
        Quan Sát Thời Tiết
        <span class="ornamental-border"></span>
      </h2>
      
      <!-- Weather status card -->
      <div class="weather-card" :class="currentWeather">
        <div class="weather-header">
          <div class="weather-icon">{{ weatherDescription.icon }}</div>
          <div class="weather-info">
            <h3 class="weather-title">{{ weatherDescription.title }}</h3>
            <p class="weather-intensity">Cường độ: {{ weatherDescription.intensity }}</p>
          </div>
        </div>
        
        <div class="weather-description">
          <p>{{ weatherDescription.description }}</p>
        </div>
        
        <!-- Rain intensity meter -->
        <div class="intensity-meter" v-if="currentWeather.includes('rain') || currentWeather === 'drizzle'">
          <label class="meter-label">Cường độ mưa:</label>
          <div class="meter-container">
            <div class="meter-track">
              <div 
                class="meter-fill"
                :style="{ width: rainIntensity + '%' }"
                :class="{ 
                  'high': rainIntensity > 70,
                  'medium': rainIntensity > 30 && rainIntensity <= 70,
                  'low': rainIntensity <= 30
                }"
              ></div>
            </div>
            <span class="meter-value">{{ rainIntensity }}%</span>
          </div>
        </div>
      </div>

      <!-- Ritual progress display -->
      <div v-if="isRitualActive" class="ritual-progress-display">
        <h3 class="progress-title">
          <span class="progress-ornament">⚡</span>
          Tiến Trình Nghi Thức
          <span class="progress-ornament">⚡</span>
        </h3>
        
        <div class="progress-container">
          <div class="traditional-progress">
            <div class="progress-track-traditional">
              <div 
                class="progress-fill-traditional"
                :style="{ width: ritualProgress + '%' }"
              ></div>
            </div>
            <div class="progress-markers">
              <span 
                v-for="i in 5" 
                :key="i"
                class="progress-marker"
                :class="{ active: ritualProgress >= (i-1) * 25 }"
              >{{ i * 20 }}%</span>
            </div>
          </div>
          
          <div class="progress-status">
            <span class="progress-text">{{ getProgressText() }}</span>
            <span class="progress-percentage">{{ Math.round(ritualProgress) }}%</span>
          </div>
        </div>
      </div>

      <!-- Weather history/prediction -->
      <div class="weather-prediction">
        <h4 class="prediction-title">Dự Báo Thời Tiết:</h4>
        <div class="prediction-timeline">
          <div class="timeline-item" :class="{ active: ritualProgress >= 0 }">
            <span class="timeline-icon">🌧️</span>
            <span class="timeline-text">Mưa to ban đầu</span>
          </div>
          <div class="timeline-item" :class="{ active: ritualProgress >= 25 }">
            <span class="timeline-icon">🌦️</span>
            <span class="timeline-text">Mưa nhỏ dần</span>
          </div>
          <div class="timeline-item" :class="{ active: ritualProgress >= 50 }">
            <span class="timeline-icon">🌫️</span>
            <span class="timeline-text">Mưa phùn</span>
          </div>
          <div class="timeline-item" :class="{ active: ritualProgress >= 75 }">
            <span class="timeline-icon">☁️</span>
            <span class="timeline-text">Có mây</span>
          </div>
          <div class="timeline-item" :class="{ active: ritualProgress >= 100 }">
            <span class="timeline-icon">☀️</span>
            <span class="timeline-text">Quang đãng</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.weather-display {
  margin: 2rem 0;
  padding: 0 2rem;
}

.weather-scroll {
  background: rgba(139, 69, 19, 0.1);
  border: 2px solid #8b4513;
  border-radius: 10px;
  padding: 2rem;
  position: relative;
}

.weather-scroll:before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px solid #cd853f;
  border-radius: 8px;
  pointer-events: none;
}

.section-title {
  text-align: center;
  color: #8b4513;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  font-weight: bold;
}

.ornamental-border {
  display: inline-block;
  width: 50px;
  height: 2px;
  background: #cd853f;
  margin: 0 1rem;
  vertical-align: middle;
  position: relative;
}

.ornamental-border:before,
.ornamental-border:after {
  content: '❖';
  position: absolute;
  top: -8px;
  color: #8b4513;
  font-size: 0.8rem;
}

.ornamental-border:before { left: -10px; }
.ornamental-border:after { right: -10px; }

.weather-card {
  background: linear-gradient(135deg, #f7f4ed 0%, #faf8f3 100%);
  border: 2px solid #cd853f;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.2);
  transition: all 0.5s ease;
}

.weather-card.heavy-rain {
  background: linear-gradient(135deg, #e8f4f8 0%, #d4edda 100%);
  border-color: #52a2cc;
}

.weather-card.light-rain {
  background: linear-gradient(135deg, #e3f2fd 0%, #e1f5fe 100%);
  border-color: #4fc3f7;
}

.weather-card.drizzle {
  background: linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%);
  border-color: #ab47bc;
}

.weather-card.cloudy {
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border-color: #9e9e9e;
}

.weather-card.clear {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border-color: #ffa726;
}

.weather-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.weather-icon {
  font-size: 3rem;
  line-height: 1;
}

.weather-info {
  flex: 1;
}

.weather-title {
  color: #654321;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: bold;
}

.weather-intensity {
  color: #8b4513;
  margin: 0;
  font-size: 0.9rem;
  font-style: italic;
}

.weather-description {
  color: #654321;
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.intensity-meter {
  margin-top: 1rem;
}

.meter-label {
  display: block;
  color: #8b4513;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.meter-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.meter-track {
  flex: 1;
  height: 12px;
  background: rgba(139, 69, 19, 0.2);
  border-radius: 6px;
  border: 1px solid #cd853f;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.meter-fill.high {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.meter-fill.medium {
  background: linear-gradient(90deg, #f39c12, #e67e22);
}

.meter-fill.low {
  background: linear-gradient(90deg, #3498db, #2980b9);
}

.meter-value {
  color: #8b4513;
  font-weight: bold;
  min-width: 40px;
}

.ritual-progress-display {
  background: rgba(139, 69, 19, 0.05);
  border: 1px solid #cd853f;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.progress-title {
  text-align: center;
  color: #8b4513;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.progress-ornament {
  color: #daa520;
  margin: 0 0.5rem;
  animation: spark 2s ease-in-out infinite;
}

@keyframes spark {
  0%, 100% { text-shadow: 0 0 5px #daa520; }
  50% { text-shadow: 0 0 15px #daa520, 0 0 25px #daa520; }
}

.progress-container {
  margin-top: 1rem;
}

.traditional-progress {
  margin-bottom: 1rem;
}

.progress-track-traditional {
  height: 15px;
  background: rgba(139, 69, 19, 0.2);
  border: 2px solid #8b4513;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.progress-fill-traditional {
  height: 100%;
  background: linear-gradient(90deg, #daa520, #cd853f);
  border-radius: 5px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
}

.progress-markers {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.progress-marker {
  font-size: 0.8rem;
  color: #8b4513;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.progress-marker.active {
  opacity: 1;
  font-weight: bold;
  color: #daa520;
}

.progress-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(139, 69, 19, 0.05);
  border-radius: 5px;
}

.progress-text {
  color: #654321;
  font-style: italic;
}

.progress-percentage {
  color: #8b4513;
  font-weight: bold;
  font-size: 1.1rem;
}

.weather-prediction {
  margin-top: 2rem;
}

.prediction-title {
  color: #8b4513;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
}

.prediction-timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.prediction-timeline:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #cd853f;
  transform: translateY(-50%);
  z-index: 1;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f7f4ed;
  border: 2px solid #cd853f;
  border-radius: 50px;
  padding: 0.5rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.timeline-item.active {
  opacity: 1;
  background: #daa520;
  border-color: #8b4513;
  box-shadow: 0 0 15px rgba(218, 165, 32, 0.5);
}

.timeline-icon {
  font-size: 1.2rem;
  margin-bottom: 0.2rem;
}

.timeline-text {
  font-size: 0.7rem;
  color: #654321;
  text-align: center;
  max-width: 60px;
  line-height: 1.2;
}

.timeline-item.active .timeline-text {
  color: #fff;
  font-weight: bold;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .weather-display {
    padding: 0 1rem;
  }
  
  .weather-scroll {
    padding: 1rem;
  }
  
  .weather-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .prediction-timeline {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .timeline-item {
    flex: 1;
    min-width: 80px;
  }
  
  .progress-status {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>