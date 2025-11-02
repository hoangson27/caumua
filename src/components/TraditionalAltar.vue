<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isRitualActive: Boolean,
  currentWeather: String
})

const emit = defineEmits(['start-ritual', 'reset-weather', 'altar-action'])

const altarState = ref({
  candle: { lit: false, name: 'Nến Thiêng', icon: '🕯️' },
  incense: { burning: false, name: 'Hương Trầm', icon: '🔥' },
  water: { blessed: false, name: 'Nước Thánh', icon: '💧' },
  flowers: { fresh: true, name: 'Hoa Sen', icon: '🪷' },
  bell: { ringing: false, name: 'Chuông Đồng', icon: '🔔' },
  scroll: { opened: false, name: 'Kinh Sách', icon: '📜' }
})

const isAltarReady = computed(() => {
  return altarState.value.candle.lit && 
         altarState.value.incense.burning && 
         altarState.value.water.blessed &&
         altarState.value.scroll.opened
})

const toggleAltarItem = (item) => {
  if (props.isRitualActive) return
  
  // Emit altar action for sound effects
  emit('altar-action', { type: item, action: 'toggle' })
  
  switch (item) {
    case 'candle':
      altarState.value.candle.lit = !altarState.value.candle.lit
      break
    case 'incense':
      altarState.value.incense.burning = !altarState.value.incense.burning
      break
    case 'water':
      altarState.value.water.blessed = !altarState.value.water.blessed
      break
    case 'bell':
      altarState.value.bell.ringing = true
      setTimeout(() => {
        altarState.value.bell.ringing = false
      }, 1500)
      break
    case 'scroll':
      altarState.value.scroll.opened = !altarState.value.scroll.opened
      break
  }
}

const startRitual = () => {
  if (isAltarReady.value && !props.isRitualActive) {
    emit('start-ritual')
  }
}

const resetWeather = () => {
  if (!props.isRitualActive) {
    emit('reset-weather')
    // Reset altar
    Object.keys(altarState.value).forEach(key => {
      if (key === 'flowers') {
        altarState.value[key].fresh = true
      } else if (key === 'bell') {
        altarState.value[key].ringing = false
      } else {
        Object.keys(altarState.value[key]).forEach(prop => {
          if (typeof altarState.value[key][prop] === 'boolean') {
            altarState.value[key][prop] = false
          }
        })
      }
    })
  }
}

const getInstructions = () => {
  const steps = []
  if (!altarState.value.candle.lit) steps.push('Thắp nến thiêng')
  if (!altarState.value.incense.burning) steps.push('Đốt hương trầm')
  if (!altarState.value.water.blessed) steps.push('Thiết lập nước thánh')
  if (!altarState.value.scroll.opened) steps.push('Mở kinh sách')
  
  return steps.length > 0 ? steps : ['Đã sẵn sàng thực hiện nghi thức']
}
</script>

<template>
  <section class="traditional-altar">
    <div class="altar-container">
      <h2 class="altar-title">
        <span class="title-decoration">※</span>
        Lễ Đài Cầu Tạnh Mưa
        <span class="title-decoration">※</span>
      </h2>
      
      <!-- Altar platform -->
      <div class="altar-platform">
        <div class="altar-backdrop">
          <div class="backdrop-pattern"></div>
        </div>
        
        <!-- Altar items arranged in traditional layout -->
        <div class="altar-items">
          <!-- Back row -->
          <div class="altar-row back-row">
            <!-- Scroll/Scripture -->
            <div 
              class="altar-item scripture"
              :class="{ 
                active: altarState.scroll.opened,
                disabled: isRitualActive
              }"
              @click="toggleAltarItem('scroll')"
              title="Nhấp để mở kinh sách"
            >
              <div class="item-icon">{{ altarState.scroll.icon }}</div>
              <div class="item-name">{{ altarState.scroll.name }}</div>
              <div class="item-status">
                {{ altarState.scroll.opened ? 'Đã mở' : 'Chưa mở' }}
              </div>
              <div v-if="altarState.scroll.opened" class="scripture-glow"></div>
            </div>
          </div>
          
          <!-- Middle row -->
          <div class="altar-row middle-row">
            <!-- Incense -->
            <div 
              class="altar-item incense"
              :class="{ 
                active: altarState.incense.burning,
                disabled: isRitualActive
              }"
              @click="toggleAltarItem('incense')"
              title="Nhấp để đốt hương"
            >
              <div class="item-icon">{{ altarState.incense.icon }}</div>
              <div class="item-name">{{ altarState.incense.name }}</div>
              <div class="item-status">
                {{ altarState.incense.burning ? 'Đang cháy' : 'Chưa đốt' }}
              </div>
              <div v-if="altarState.incense.burning" class="incense-smoke">
                <div class="smoke-particle" v-for="i in 5" :key="i"></div>
              </div>
            </div>
            
            <!-- Bell -->
            <div 
              class="altar-item bell"
              :class="{ 
                active: altarState.bell.ringing,
                disabled: isRitualActive
              }"
              @click="toggleAltarItem('bell')"
              title="Nhấp để rung chuông"
            >
              <div class="item-icon" :class="{ ringing: altarState.bell.ringing }">
                {{ altarState.bell.icon }}
              </div>
              <div class="item-name">{{ altarState.bell.name }}</div>
              <div class="item-status">
                {{ altarState.bell.ringing ? 'Đang rung' : 'Im lặng' }}
              </div>
              <div v-if="altarState.bell.ringing" class="sound-waves">
                <div class="wave" v-for="i in 3" :key="i"></div>
              </div>
            </div>
          </div>
          
          <!-- Front row -->
          <div class="altar-row front-row">
            <!-- Candle -->
            <div 
              class="altar-item candle"
              :class="{ 
                active: altarState.candle.lit,
                disabled: isRitualActive
              }"
              @click="toggleAltarItem('candle')"
              title="Nhấp để thắp nến"
            >
              <div class="item-icon">{{ altarState.candle.icon }}</div>
              <div class="item-name">{{ altarState.candle.name }}</div>
              <div class="item-status">
                {{ altarState.candle.lit ? 'Đã thắp' : 'Chưa thắp' }}
              </div>
              <div v-if="altarState.candle.lit" class="candle-flame"></div>
            </div>
            
            <!-- Holy Water -->
            <div 
              class="altar-item water"
              :class="{ 
                active: altarState.water.blessed,
                disabled: isRitualActive
              }"
              @click="toggleAltarItem('water')"
              title="Nhấp để thiết lập nước thánh"
            >
              <div class="item-icon">{{ altarState.water.icon }}</div>
              <div class="item-name">{{ altarState.water.name }}</div>
              <div class="item-status">
                {{ altarState.water.blessed ? 'Đã thiết lập' : 'Chưa thiết lập' }}
              </div>
              <div v-if="altarState.water.blessed" class="water-ripple"></div>
            </div>
            
            <!-- Flowers -->
            <div class="altar-item flowers static">
              <div class="item-icon">{{ altarState.flowers.icon }}</div>
              <div class="item-name">{{ altarState.flowers.name }}</div>
              <div class="item-status">Tươi mới</div>
              <div class="flower-petals">
                <div class="petal" v-for="i in 6" :key="i"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Preparation status -->
      <div class="preparation-status">
        <h3 class="status-title">Trạng Thái Chuẩn Bị:</h3>
        <div class="status-grid">
          <div class="status-item" :class="{ complete: isAltarReady }">
            <span class="status-icon">{{ isAltarReady ? '✅' : '⏳' }}</span>
            <span class="status-text">
              {{ isAltarReady ? 'Đã sẵn sàng' : 'Đang chuẩn bị' }}
            </span>
          </div>
        </div>
        
        <div class="instructions-list">
          <h4>Cần thực hiện:</h4>
          <ul>
            <li v-for="instruction in getInstructions()" :key="instruction">
              {{ instruction }}
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Control buttons -->
      <div class="altar-controls">
        <button 
          @click="startRitual"
          class="ritual-btn start-btn"
          :disabled="!isAltarReady || isRitualActive"
          :class="{ 
            ready: isAltarReady && !isRitualActive,
            active: isRitualActive,
            disabled: !isAltarReady || isRitualActive
          }"
        >
          <span v-if="isRitualActive">
            🌀 Đang Thực Hiện Nghi Thức...
          </span>
          <span v-else-if="isAltarReady">
            🙏 Bắt Đầu Nghi Thức Cầu Tạnh Mưa
          </span>
          <span v-else>
            ⚠️ Hoàn Thành Chuẩn Bị Trước
          </span>
        </button>
        
        <button 
          @click="resetWeather"
          class="ritual-btn reset-btn"
          :disabled="isRitualActive"
          v-if="currentWeather !== 'heavy-rain'"
        >
          🔄 Đặt Lại Thời Tiết
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.traditional-altar {
  margin: 3rem 0;
  padding: 0 2rem;
}

.altar-container {
  background: linear-gradient(135deg, #f7f4ed 0%, #faf8f3 100%);
  border: 3px solid #8b4513;
  border-radius: 15px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 10px 30px rgba(139, 69, 19, 0.3);
}

.altar-container:before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 2px solid #cd853f;
  border-radius: 10px;
  pointer-events: none;
}

.altar-title {
  text-align: center;
  color: #8b4513;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  font-weight: bold;
  position: relative;
}

.title-decoration {
  color: #daa520;
  margin: 0 1rem;
  font-size: 1.2rem;
  animation: decoration-glow 3s ease-in-out infinite;
}

@keyframes decoration-glow {
  0%, 100% { text-shadow: 0 0 5px #daa520; }
  50% { text-shadow: 0 0 15px #daa520, 0 0 25px #daa520; }
}

.altar-platform {
  position: relative;
  background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
  border: 2px solid #654321;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  min-height: 300px;
}

.altar-backdrop {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: linear-gradient(135deg, #daa520 0%, #cd853f 100%);
  border-radius: 8px;
  opacity: 0.3;
}

.backdrop-pattern {
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(139, 69, 19, 0.2) 0%, transparent 50%);
}

.altar-items {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.altar-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 1rem 0;
}

.back-row {
  justify-content: center;
}

.middle-row {
  gap: 4rem;
}

.front-row {
  gap: 1.5rem;
}

.altar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(244, 241, 232, 0.9);
  border: 2px solid #8b4513;
  border-radius: 10px;
  padding: 1rem;
  min-width: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.2);
}

.altar-item:hover:not(.disabled):not(.static) {
  transform: translateY(-5px);
  border-color: #daa520;
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.3);
}

.altar-item.active {
  background: rgba(218, 165, 32, 0.2);
  border-color: #daa520;
  box-shadow: 0 0 20px rgba(218, 165, 32, 0.4);
}

.altar-item.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.altar-item.static {
  cursor: default;
  background: rgba(244, 241, 232, 0.7);
}

.item-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.item-icon.ringing {
  animation: bell-ring 1.5s ease-in-out;
}

@keyframes bell-ring {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

.item-name {
  color: #654321;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  text-align: center;
}

.item-status {
  color: #8b4513;
  font-size: 0.8rem;
  font-style: italic;
}

/* Special effects */
.candle-flame {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 12px;
  background: radial-gradient(circle, #ff6b35, #f39c12);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: flame-flicker 1s ease-in-out infinite alternate;
}

@keyframes flame-flicker {
  0% { transform: translateX(-50%) scale(1) rotate(-2deg); }
  100% { transform: translateX(-50%) scale(1.1) rotate(2deg); }
}

.incense-smoke {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 30px;
}

.smoke-particle {
  position: absolute;
  width: 3px;
  height: 8px;
  background: rgba(200, 200, 200, 0.6);
  border-radius: 50%;
  animation: smoke-rise 3s ease-out infinite;
}

.smoke-particle:nth-child(1) { left: 8px; animation-delay: 0s; }
.smoke-particle:nth-child(2) { left: 10px; animation-delay: 0.5s; }
.smoke-particle:nth-child(3) { left: 12px; animation-delay: 1s; }
.smoke-particle:nth-child(4) { left: 9px; animation-delay: 1.5s; }
.smoke-particle:nth-child(5) { left: 11px; animation-delay: 2s; }

@keyframes smoke-rise {
  0% { 
    opacity: 0.8; 
    transform: translateY(0) translateX(0) scale(1); 
  }
  100% { 
    opacity: 0; 
    transform: translateY(-30px) translateX(5px) scale(1.5); 
  }
}

.water-ripple {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: rgba(52, 152, 219, 0.3);
  border-radius: 50%;
  animation: water-ripple 2s ease-in-out infinite;
}

@keyframes water-ripple {
  0%, 100% { 
    transform: translateX(-50%) scale(1);
    opacity: 0.6;
  }
  50% { 
    transform: translateX(-50%) scale(1.5);
    opacity: 0.2;
  }
}

.scripture-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(218, 165, 32, 0.2);
  border-radius: 8px;
  animation: scripture-glow 3s ease-in-out infinite;
}

@keyframes scripture-glow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

.sound-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(218, 165, 32, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: sound-wave 1.5s ease-out infinite;
}

.wave:nth-child(1) { animation-delay: 0s; }
.wave:nth-child(2) { animation-delay: 0.3s; }
.wave:nth-child(3) { animation-delay: 0.6s; }

@keyframes sound-wave {
  0% {
    width: 20px;
    height: 20px;
    opacity: 1;
  }
  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
  }
}

.flower-petals {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.petal {
  position: absolute;
  width: 4px;
  height: 8px;
  background: rgba(255, 192, 203, 0.6);
  border-radius: 50%;
  animation: petal-sway 4s ease-in-out infinite;
}

.petal:nth-child(1) { transform: rotate(0deg) translateY(-15px); animation-delay: 0s; }
.petal:nth-child(2) { transform: rotate(60deg) translateY(-15px); animation-delay: 0.5s; }
.petal:nth-child(3) { transform: rotate(120deg) translateY(-15px); animation-delay: 1s; }
.petal:nth-child(4) { transform: rotate(180deg) translateY(-15px); animation-delay: 1.5s; }
.petal:nth-child(5) { transform: rotate(240deg) translateY(-15px); animation-delay: 2s; }
.petal:nth-child(6) { transform: rotate(300deg) translateY(-15px); animation-delay: 2.5s; }

@keyframes petal-sway {
  0%, 100% { transform: rotate(var(--rotation, 0deg)) translateY(-15px) scale(1); }
  50% { transform: rotate(var(--rotation, 0deg)) translateY(-18px) scale(1.1); }
}

.preparation-status {
  background: rgba(139, 69, 19, 0.1);
  border: 1px solid #cd853f;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.status-title {
  color: #8b4513;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: center;
}

.status-grid {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: rgba(231, 76, 60, 0.1);
  border: 2px solid rgba(231, 76, 60, 0.3);
  border-radius: 25px;
  transition: all 0.3s ease;
}

.status-item.complete {
  background: rgba(46, 204, 113, 0.1);
  border-color: rgba(46, 204, 113, 0.3);
}

.status-icon {
  font-size: 1.1rem;
}

.status-text {
  color: #654321;
  font-weight: bold;
}

.instructions-list {
  text-align: center;
}

.instructions-list h4 {
  color: #8b4513;
  margin-bottom: 0.5rem;
}

.instructions-list ul {
  list-style: none;
  padding: 0;
  color: #654321;
}

.instructions-list li {
  margin: 0.3rem 0;
  font-size: 0.9rem;
}

.altar-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.ritual-btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border: 2px solid #8b4513;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  text-align: center;
}

.ritual-btn.start-btn.disabled {
  background: rgba(149, 165, 166, 0.2);
  color: rgba(101, 67, 33, 0.5);
  cursor: not-allowed;
}

.ritual-btn.start-btn.ready {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.3));
  color: #27ae60;
  border-color: #27ae60;
}

.ritual-btn.start-btn.ready:hover {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.3), rgba(39, 174, 96, 0.4));
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
}

.ritual-btn.start-btn.active {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(41, 128, 185, 0.3));
  color: #3498db;
  border-color: #3498db;
  animation: ritual-active 2s ease-in-out infinite;
}

@keyframes ritual-active {
  0%, 100% { box-shadow: 0 0 10px rgba(52, 152, 219, 0.3); }
  50% { box-shadow: 0 0 20px rgba(52, 152, 219, 0.5); }
}

.ritual-btn.reset-btn {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  border-color: #f39c12;
}

.ritual-btn.reset-btn:hover {
  background: rgba(243, 156, 18, 0.3);
  transform: translateY(-2px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .traditional-altar {
    padding: 0 1rem;
  }
  
  .altar-container {
    padding: 1rem;
  }
  
  .altar-platform {
    padding: 1rem;
    min-height: 250px;
  }
  
  .altar-row {
    gap: 1rem;
  }
  
  .middle-row {
    gap: 2rem;
  }
  
  .front-row {
    gap: 0.8rem;
  }
  
  .altar-item {
    min-width: 80px;
    padding: 0.8rem;
  }
  
  .item-icon {
    font-size: 1.5rem;
  }
  
  .item-name {
    font-size: 0.8rem;
  }
  
  .item-status {
    font-size: 0.7rem;
  }
  
  .ritual-btn {
    min-width: 150px;
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>