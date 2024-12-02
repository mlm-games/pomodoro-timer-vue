import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    workDuration: 25,
    breakDuration: 5,
    autoStartBreaks: false,
    notifications: true,
    minimizeToTray: true
  }),

  actions: {
    loadSettings() {
      const saved = localStorage.getItem('pomodoro-settings')
      if (saved) {
        const settings = JSON.parse(saved)
        this.workDuration = settings.workDuration
        this.breakDuration = settings.breakDuration
        this.autoStartBreaks = settings.autoStartBreaks
        this.notifications = settings.notifications
        this.minimizeToTray = settings.minimizeToTray
      }
    },

    saveSettings() {
      localStorage.setItem('pomodoro-settings', JSON.stringify({
        workDuration: this.workDuration,
        breakDuration: this.breakDuration,
        autoStartBreaks: this.autoStartBreaks,
        notifications: this.notifications,
        minimizeToTray: this.minimizeToTray
      }))
    }
  }
})