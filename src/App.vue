<template>
  <div class="app">
    <h1>Pomodoro Timer</h1>
    
    <div class="timer">
      <div class="time-display">{{ store.formattedTime }}</div>
      
      <div class="mode-selector">
        <button 
          @click="store.setMode('work')"
          :class="{ active: store.mode === 'work' }"
        >
          Work
        </button>
        <button 
          @click="store.setMode('break')"
          :class="{ active: store.mode === 'break' }"
        >
          Break
        </button>
      </div>

      <div class="controls">
        <button 
          @click="startTimer" 
          :disabled="store.isRunning"
        >
          Start
        </button>
        <button 
          @click="store.pauseTimer" 
          :disabled="!store.isRunning"
        >
          Pause
        </button>
        <button @click="store.resetTimer">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTimerStore } from './stores/timer'
import { onBeforeUnmount, onMounted } from 'vue'

const store = useTimerStore()
let timerInterval

function startTimer() {
  store.startTimer()
  timerInterval = setInterval(() => {
    store.tick()
  }, 1000)
}

onMounted(() => {
  document.title = 'Pomodoro Timer'
})

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style>
.app {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.time-display {
  font-size: 4em;
  font-weight: bold;
  margin: 20px 0;
  font-family: monospace;
}

.mode-selector {
  margin: 20px 0;
}

.controls {
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  margin: 0 5px;
  font-size: 1.1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

.mode-selector button {
  background-color: #2196F3;
}

.mode-selector button.active {
  background-color: #1565C0;
}
</style>
