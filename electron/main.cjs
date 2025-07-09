const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

let mainWindow
let tray

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, '../public/icon.png'))
  tray = new Tray(icon)
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      click: () => mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ])

  tray.setToolTip('Pomodoro Timer')
  tray.setContextMenu(contextMenu)
  
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, '../public/icon.png')
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })
}

app.whenReady().then(() => {
  createWindow()
  createTray()
})

app.on('before-quit', () => {
  app.isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})