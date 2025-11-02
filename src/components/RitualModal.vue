<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'begin-ritual'])

const selectedPrayers = ref([])
const ritualIntensity = ref('medium')
const preparationTime = ref(3)

const availablePrayers = [
  { id: 'traditional', name: 'Kinh Cầu Tạnh Mưa Truyền Thống', duration: 5 },
  { id: 'modern', name: 'Lời Cầu Nguyện Hiện Đại', duration: 3 },
  { id: 'nature', name: 'Kêu Gọi Thiên Nhiên', duration: 4 },
  { id: 'ancient', name: 'Thần Chú Cổ Xưa', duration: 6 }
]

const intensityOptions = [
  { value: 'gentle', name: 'Nhẹ Nhàng', description: 'Tác động từ từ, phù hợp với mưa nhỏ' },
  { value: 'medium', name: 'Trung Bình', description: 'Cân bằng giữa hiệu quả và an toàn' },
  { value: 'strong', name: 'Mạnh Mẽ', description: 'Tác động nhanh, dành cho mưa to' }
]

const togglePrayer = (prayerId) => {
  const index = selectedPrayers.value.indexOf(prayerId)
  if (index > -1) {
    selectedPrayers.value.splice(index, 1)
  } else {
    selectedPrayers.value.push(prayerId)
  }
}

const getTotalDuration = () => {
  return selectedPrayers.value.reduce((total, prayerId) => {
    const prayer = availablePrayers.find(p => p.id === prayerId)
    return total + (prayer ? prayer.duration : 0)
  }, 0) + preparationTime.value
}

const beginRitual = () => {
  if (selectedPrayers.value.length > 0) {
    emit('begin-ritual', {
      prayers: selectedPrayers.value,
      intensity: ritualIntensity.value,
      duration: getTotalDuration()
    })
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div class="ritual-modal-overlay" @click="closeModal">
    <div class="ritual-modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          <span class="title-ornament">🔮</span>
          Chuẩn Bị Nghi Thức Cầu Tạnh Mưa
          <span class="title-ornament">🔮</span>
        </h2>
        <button @click="closeModal" class="close-button">&times;</button>
      </div>

      <div class="modal-content">
        <!-- Prayer selection -->
        <div class="section">
          <h3 class="section-title">Chọn Lời Cầu Nguyện:</h3>
          <div class="prayer-grid">
            <div 
              v-for="prayer in availablePrayers"
              :key="prayer.id"
              class="prayer-option"
              :class="{ selected: selectedPrayers.includes(prayer.id) }"
              @click="togglePrayer(prayer.id)"
            >
              <div class="prayer-icon">📿</div>
              <div class="prayer-info">
                <h4>{{ prayer.name }}</h4>
                <p>Thời gian: {{ prayer.duration }} phút</p>
              </div>
              <div class="selection-indicator">
                {{ selectedPrayers.includes(prayer.id) ? '✅' : '⭕' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Intensity selection -->
        <div class="section">
          <h3 class="section-title">Cường Độ Nghi Thức:</h3>
          <div class="intensity-options">
            <label 
              v-for="option in intensityOptions"
              :key="option.value"
              class="intensity-option"
              :class="{ selected: ritualIntensity === option.value }"
            >
              <input 
                type="radio" 
                :value="option.value" 
                v-model="ritualIntensity"
                hidden
              >
              <div class="option-content">
                <h4>{{ option.name }}</h4>
                <p>{{ option.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Preparation time -->
        <div class="section">
          <h3 class="section-title">Thời Gian Chuẩn Bị:</h3>
          <div class="time-selector">
            <label class="time-label">
              Thời gian tĩnh tâm:
              <select v-model="preparationTime" class="time-select">
                <option value="1">1 phút</option>
                <option value="3">3 phút</option>
                <option value="5">5 phút</option>
                <option value="10">10 phút</option>
              </select>
            </label>
          </div>
        </div>

        <!-- Summary -->
        <div class="section summary">
          <h3 class="section-title">Tổng Kết:</h3>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Số lời cầu nguyện:</span>
              <span class="summary-value">{{ selectedPrayers.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Cường độ:</span>
              <span class="summary-value">
                {{ intensityOptions.find(o => o.value === ritualIntensity)?.name }}
              </span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Tổng thời gian:</span>
              <span class="summary-value">{{ getTotalDuration() }} phút</span>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="section instructions">
          <h3 class="section-title">Hướng Dẫn:</h3>
          <div class="instruction-list">
            <div class="instruction-item">
              <span class="instruction-number">1</span>
              <span class="instruction-text">Tìm một nơi yên tĩnh, thoải mái</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-number">2</span>
              <span class="instruction-text">Tập trung tâm thần, loại bỏ tạp niệm</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-number">3</span>
              <span class="instruction-text">Cầu nguyện với lòng thành kính</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-number">4</span>
              <span class="instruction-text">Tin tưởng vào sức mạnh của nghi thức</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="cancel-btn">
          Hủy Bỏ
        </button>
        <button 
          @click="beginRitual" 
          class="begin-btn"
          :disabled="selectedPrayers.length === 0"
          :class="{ disabled: selectedPrayers.length === 0 }"
        >
          <span v-if="selectedPrayers.length === 0">
            Chọn Ít Nhất Một Lời Cầu Nguyện
          </span>
          <span v-else>
            🙏 Bắt Đầu Nghi Thức
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ritual-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  padding: 1rem;
}

.ritual-modal {
  background: linear-gradient(135deg, #f7f4ed 0%, #faf8f3 100%);
  border: 3px solid #8b4513;
  border-radius: 15px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative;
}

.ritual-modal:before {
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

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 2px solid #cd853f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.modal-title {
  color: #8b4513;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.title-ornament {
  color: #daa520;
  margin: 0 0.5rem;
  animation: ornament-pulse 2s ease-in-out infinite;
}

@keyframes ornament-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #8b4513;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #cd853f;
}

.modal-content {
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(139, 69, 19, 0.05);
  border: 1px solid #cd853f;
  border-radius: 10px;
}

.section-title {
  color: #8b4513;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.prayer-grid {
  display: grid;
  gap: 1rem;
}

.prayer-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(244, 241, 232, 0.8);
  border: 2px solid #cd853f;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prayer-option:hover {
  background: rgba(218, 165, 32, 0.2);
  transform: translateY(-2px);
}

.prayer-option.selected {
  background: rgba(218, 165, 32, 0.3);
  border-color: #daa520;
  box-shadow: 0 0 15px rgba(218, 165, 32, 0.3);
}

.prayer-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.prayer-info {
  flex: 1;
}

.prayer-info h4 {
  margin: 0 0 0.3rem 0;
  color: #654321;
  font-size: 1rem;
}

.prayer-info p {
  margin: 0;
  color: #8b4513;
  font-size: 0.9rem;
  font-style: italic;
}

.selection-indicator {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.intensity-options {
  display: grid;
  gap: 1rem;
}

.intensity-option {
  display: block;
  padding: 1rem;
  background: rgba(244, 241, 232, 0.8);
  border: 2px solid #cd853f;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.intensity-option:hover {
  background: rgba(218, 165, 32, 0.2);
}

.intensity-option.selected {
  background: rgba(218, 165, 32, 0.3);
  border-color: #daa520;
  box-shadow: 0 0 15px rgba(218, 165, 32, 0.3);
}

.option-content h4 {
  margin: 0 0 0.3rem 0;
  color: #654321;
  font-size: 1rem;
}

.option-content p {
  margin: 0;
  color: #8b4513;
  font-size: 0.9rem;
}

.time-selector {
  text-align: center;
}

.time-label {
  color: #654321;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.time-select {
  padding: 0.5rem 1rem;
  border: 2px solid #cd853f;
  border-radius: 5px;
  background: #f7f4ed;
  color: #654321;
  font-size: 1rem;
}

.summary {
  background: rgba(218, 165, 32, 0.1);
  border-color: #daa520;
}

.summary-content {
  display: grid;
  gap: 0.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-label {
  color: #654321;
  font-weight: bold;
}

.summary-value {
  color: #8b4513;
  font-weight: bold;
}

.instructions {
  background: rgba(46, 204, 113, 0.1);
  border-color: #27ae60;
}

.instruction-list {
  display: grid;
  gap: 0.8rem;
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.instruction-number {
  width: 25px;
  height: 25px;
  background: #27ae60;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.instruction-text {
  color: #654321;
  font-size: 0.95rem;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  border-top: 2px solid #cd853f;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.cancel-btn,
.begin-btn {
  padding: 0.8rem 1.5rem;
  border: 2px solid #8b4513;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.cancel-btn {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border-color: #e74c3c;
}

.cancel-btn:hover {
  background: rgba(231, 76, 60, 0.3);
  transform: translateY(-2px);
}

.begin-btn {
  background: rgba(46, 204, 113, 0.2);
  color: #27ae60;
  border-color: #27ae60;
}

.begin-btn:hover:not(.disabled) {
  background: rgba(46, 204, 113, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
}

.begin-btn.disabled {
  background: rgba(149, 165, 166, 0.2);
  color: rgba(101, 67, 33, 0.5);
  border-color: rgba(149, 165, 166, 0.5);
  cursor: not-allowed;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .ritual-modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .modal-title {
    font-size: 1.3rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .section {
    padding: 1rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem 1.5rem;
    flex-direction: column;
  }
  
  .prayer-option,
  .intensity-option {
    padding: 0.8rem;
  }
  
  .time-label {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>