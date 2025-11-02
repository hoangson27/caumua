// SoundManager.js - Quản lý âm thanh cho ứng dụng cầu tạnh mưa

class SoundManager {
  constructor() {
    this.audioContext = null
    this.sounds = {}
    this.isEnabled = true
    this.volume = 0.5
    
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API không được hỗ trợ:', error)
      this.isEnabled = false
    }
  }

  // Tạo âm thanh bằng oscillator
  createTone(frequency, duration, type = 'sine', fadeOut = true) {
    if (!this.isEnabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
    
    if (fadeOut) {
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
    }
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
    
    return oscillator
  }

  // Âm thanh chuông chùa (temple bell)
  playTempleBell() {
    if (!this.isEnabled) return
    
    // Tạo âm thanh chuông với harmonic
    const frequencies = [220, 440, 660, 880]
    const baseTime = this.audioContext.currentTime
    
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, baseTime)
        oscillator.type = 'triangle'
        
        const volume = this.volume * (1 - index * 0.2) // Giảm dần âm lượng
        gainNode.gain.setValueAtTime(volume, baseTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, baseTime + 3)
        
        oscillator.start(baseTime)
        oscillator.stop(baseTime + 3)
      }, index * 100)
    })
  }

  // Âm thanh nước chảy
  playWaterSound() {
    if (!this.isEnabled) return
    
    // Tạo white noise để mô phỏng âm thanh nước
    const bufferSize = this.audioContext.sampleRate * 2
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1 // White noise nhẹ
    }
    
    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    source.buffer = buffer
    source.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    // Filter để tạo âm thanh nước chảy
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2)
    
    source.start()
    source.stop(this.audioContext.currentTime + 2)
  }

  // Âm thanh lửa cháy
  playFireSound() {
    if (!this.isEnabled) return
    
    // Tạo crackling sound
    const duration = 1.5
    const baseTime = this.audioContext.currentTime
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const frequency = 200 + Math.random() * 300
        const crackleDuration = 0.1 + Math.random() * 0.2
        
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)
        
        oscillator.frequency.setValueAtTime(frequency, baseTime)
        oscillator.type = 'sawtooth'
        
        gainNode.gain.setValueAtTime(this.volume * 0.2, baseTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, baseTime + crackleDuration)
        
        oscillator.start(baseTime)
        oscillator.stop(baseTime + crackleDuration)
      }, i * 150)
    }
  }

  // Âm thanh hương cháy (tiếng xì xì nhẹ)
  playIncenseSound() {
    if (!this.isEnabled) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(4000, this.audioContext.currentTime)
    oscillator.type = 'sawtooth'
    
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(3000, this.audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1)
    
    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 1)
  }

  // Âm thanh cuộn giấy
  playScrollSound() {
    if (!this.isEnabled) return
    
    const frequencies = [800, 600, 400]
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.2, 'square', true)
      }, index * 50)
    })
  }

  // Âm thanh mưa
  playRainSound() {
    if (!this.isEnabled) return
    
    // White noise filtered để tạo âm thanh mưa
    const bufferSize = this.audioContext.sampleRate * 3
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3
    }
    
    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    source.buffer = buffer
    source.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1200, this.audioContext.currentTime)
    filter.Q.setValueAtTime(0.5, this.audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3)
    
    source.start()
    source.stop(this.audioContext.currentTime + 3)
  }

  // Âm thanh sấm sét
  playThunderSound() {
    if (!this.isEnabled) return
    
    // Tạo âm thanh sấm với noise burst
    const bufferSize = this.audioContext.sampleRate * 2
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      const decay = 1 - (i / bufferSize)
      data[i] = (Math.random() * 2 - 1) * decay * 0.8
    }
    
    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    source.buffer = buffer
    source.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(this.volume * 0.6, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2)
    
    source.start()
    source.stop(this.audioContext.currentTime + 2)
  }

  // Âm thanh wind chimes (chuông gió)
  playWindChimes() {
    if (!this.isEnabled) return
    
    const chimeFreqs = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00] // C, D, E, F, G, A
    const numChimes = 5 + Math.floor(Math.random() * 3) // 5-7 chimes
    
    for (let i = 0; i < numChimes; i++) {
      setTimeout(() => {
        const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)]
        this.createTone(freq, 1.5, 'sine', true)
      }, i * (200 + Math.random() * 300))
    }
  }

  // Âm thanh notification
  playNotification(type = 'info') {
    if (!this.isEnabled) return
    
    switch (type) {
      case 'success':
        this.createTone(659.25, 0.2)
        setTimeout(() => this.createTone(783.99, 0.3), 150)
        break
      case 'error':
        this.createTone(220, 0.4, 'square')
        break
      case 'warning':
        this.createTone(440, 0.3)
        setTimeout(() => this.createTone(440, 0.3), 200)
        break
      default:
        this.createTone(523.25, 0.3)
    }
  }

  // Âm thanh ambient cho nghi thức
  playRitualAmbient() {
    if (!this.isEnabled) return
    
    // Tạo âm thanh nền linh thiêng
    const frequencies = [110, 220, 330] // Bass tones
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 5)
      
      oscillator.start(this.audioContext.currentTime + index * 0.5)
      oscillator.stop(this.audioContext.currentTime + 5)
    })
  }

  // Bật/tắt âm thanh
  toggleSound() {
    this.isEnabled = !this.isEnabled
    return this.isEnabled
  }

  // Điều chỉnh âm lượng
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  // Resume audio context (cần thiết cho một số browser)
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }
}

// Export singleton instance
const soundManager = new SoundManager()
export default soundManager