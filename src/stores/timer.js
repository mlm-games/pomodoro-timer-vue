import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    timeLeft: 25 * 60,
    isRunning: false,
    mode: 'work',
    intervals: {
      work: 25 * 60,
      break: 5 * 60
    }
  }),
  
  getters: {
    formattedTime: (state) => {
      const minutes = Math.floor(state.timeLeft / 60)
      const seconds = state.timeLeft % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  },
  
  actions: {
    startTimer() {
      this.isRunning = true
    },
    
    pauseTimer() {
      this.isRunning = false
    },
    
    resetTimer() {
      this.timeLeft = this.intervals[this.mode]
      this.isRunning = false
    },
    
    setMode(newMode) {
      this.mode = newMode
      this.timeLeft = this.intervals[newMode]
      this.isRunning = false
    },
    
    tick() {
      if (this.timeLeft > 0) {
        this.timeLeft--
      } else {
        this.isRunning = false
        this.playAlarm()
      }
    }
  }
})
