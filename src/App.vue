<template>
  <div class="app">
    <header>
      <h1>Pomodoro Timer</h1>
      <button class="settings-btn" @click="showSettings = !showSettings">
        ⚙️ Settings
      </button>
    </header>
    <div v-if="!showSettings" class="timer">
    
      <div class="timer">
        <div class="progress-bar">
          <div 
            class="progress" 
            :style="{ 
              width: `${(store.timeLeft / store.intervals[store.mode]) * 100}%` 
            }"
          ></div>
        </div>
        <div class="time-display">{{ store.formattedTime }}</div>
        
        <div class="mode-selector">
          <button 
            @click="store.setMode('work')"
            :class="{ active: store.mode === 'work' }"
          >
            Work (25:00)
          </button>
          <button 
            @click="store.setMode('break')"
            :class="{ active: store.mode === 'break' }"
          >
            Break (5:00)
          </button>
        </div>

        <div class="controls">
          <button 
            @click="toggleTimer" 
            :class="{ 'pause': store.isRunning }"
          >
            {{ store.isRunning ? 'Pause' : 'Start' }}
          </button>
          <button @click="store.resetTimer">
            Reset
          </button>
        </div>

        <div class="stats">
          <p>Completed Pomodoros: {{ store.completedPomodoros }}</p>
        </div>

        <div class="shortcuts">
          <p>Shortcuts:</p>
          <ul>
            <li>Space - Start/Pause</li>
            <li>R - Reset</li>
            <li>M - Minimize to tray</li>
          </ul>
        </div>
      </div>
    </div>

    <Settings v-else />
  </div>
</template>

<script setup>
import Settings from './components/Settings.vue'
import { useTimerStore } from './stores/timer'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const showSettings = ref(false)
const store = useTimerStore()
let timerInterval

function toggleTimer() {
  if (store.isRunning) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function startTimer() {
  store.startTimer()
  timerInterval = setInterval(() => {
    store.tick()
  }, 1000)
}

function pauseTimer() {
  store.pauseTimer()
  clearInterval(timerInterval)
}

function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return

    switch(e.code) {
      case 'Space':
        e.preventDefault()
        toggleTimer()
        break
      case 'KeyR':
        e.preventDefault()
        store.resetTimer()
        break
      case 'KeyM':
        e.preventDefault()
        window.electron?.send('minimize-to-tray')
        break
      case 'KeyS':
        e.preventDefault()
        showSettings.value = !showSettings.value
        break
    }
  })
}

onMounted(() => {
  document.title = 'Pomodoro Timer'
  setupKeyboardShortcuts()
  
  // Request notification permission
  if (Notification.permission === 'default') {
    Notification.requestPermission()
  }
})

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #4CAF50;
  --primary-dark: #388E3C;
  --accent-color: #2196F3;
  --accent-dark: #1976D2;
  --bg-color: #1E1E1E;
  --card-bg: #252525;
  --text-primary: #FFFFFF;
  --text-secondary: #B3B3B3;
  --danger-color: #f44336;
  --warning-color: #ff9800;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-primary);
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.app {
  width: 100%;
  max-width: 480px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

.settings-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.time-display {
  font-size: 6rem;
  font-weight: 700;
  margin: 2rem 0;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin: 1.5rem 0;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transition: width 1s linear;
}

.mode-selector {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.mode-selector button {
  flex: 1;
  padding: 1rem;
  font-size: 1rem;
  background: rgba(33, 150, 243, 0.15);
  color: var(--text-primary);
}

.mode-selector button.active {
  background: var(--accent-color);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.controls {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.controls button {
  flex: 1;
  padding: 1.2rem;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

button {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: var(--primary-color);
  color: var(--text-primary);
  font-weight: 600;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  background: rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
}

button.pause {
  background: var(--warning-color);
}

.stats {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: var(--text-secondary);
}

.shortcuts {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.shortcuts p {
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 1rem;
}

.shortcuts ul {
  list-style: none;
}

.shortcuts li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.shortcuts li::before {
  content: '⌨️';
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .app {
    margin: 0;
    min-height: 100vh;
    border-radius: 0;
  }

  .time-display {
    font-size: 4rem;
  }
}

/* Optional: Add smooth transitions for theme changes */
* {
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
}

/* Optional: Add pulsing animation for the active timer */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.timer.running .time-display {
  animation: pulse 2s infinite;
}
</style>