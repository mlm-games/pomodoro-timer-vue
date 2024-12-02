<template>
    <div class="settings">
      <h2>Settings</h2>
      
      <div class="setting-group">
        <label>
          Work Duration (minutes):
          <input 
            type="number" 
            v-model="settings.workDuration"
            min="1" 
            max="60"
            @change="saveSettings"
          >
        </label>
        
        <label>
          Break Duration (minutes):
          <input 
            type="number" 
            v-model="settings.breakDuration"
            min="1" 
            max="30"
            @change="saveSettings"
          >
        </label>
      </div>
      
      <div class="setting-group">
        <label>
          <input 
            type="checkbox" 
            v-model="settings.autoStartBreaks"
            @change="saveSettings"
          >
          Auto-start breaks
        </label>
        
        <label>
          <input 
            type="checkbox" 
            v-model="settings.notifications"
            @change="saveSettings"
          >
          Show notifications
        </label>
        
        <label>
          <input 
            type="checkbox" 
            v-model="settings.minimizeToTray"
            @change="saveSettings"
          >
          Minimize to tray
        </label>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useSettingsStore } from '../stores/settings'
  
  const settings = useSettingsStore()
  
  function saveSettings() {
    settings.saveSettings()
  }
  </script>
  
  <style scoped>
  .settings {
    padding: 20px;
  }
  
  .setting-group {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  input[type="number"] {
    width: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
  </style>