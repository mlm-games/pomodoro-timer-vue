import { defineStore } from 'pinia'
import { useSettingsStore } from './settings'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    timeLeft: 25 * 60,
    isRunning: false,
    mode: 'work',
    intervals: {
      work: 25 * 60,
      break: 5 * 60
    },
    completedPomodoros: 0
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
      const settings = useSettingsStore()
      this.intervals = {
        work: settings.workDuration * 60,
        break: settings.breakDuration * 60
      }
      this.timeLeft = this.intervals[this.mode]
      this.isRunning = false
    },

    setMode(newMode) {
      this.mode = newMode
      this.resetTimer()
    },

    tick() {
      if (this.timeLeft > 0) {
        this.timeLeft--
      } else {
        this.handleTimerComplete()
      }
    },

    handleTimerComplete() {
      const settings = useSettingsStore()
      
      if (this.mode === 'work') {
        this.completedPomodoros++
        this.mode = 'break'
      } else {
        this.mode = 'work'
      }

      this.resetTimer()
      this.playNotification()

      if (settings.autoStartBreaks) {
        this.startTimer()
      }
    },

    playNotification() {
      const settings = useSettingsStore()
      if (settings.notifications) {
        // Play sound
        const audio = new Audio()
        audio.play().catch(e => console.log('Audio play failed:', e))

        // Show notification
        if (Notification.permission === 'granted') {
          new Notification('Pomodoro Timer', {
            body: this.mode === 'work' ? 'Break time!' : 'Time to work!'
          })
        }
      }
    }
  }
})