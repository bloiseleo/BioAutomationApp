const {app, BrowserWindow, ipcMain} = require('electron')
const url = require("url");
const path = require("path");
const ExtraResources = require("./config/ExrtaResources.js")
const extraResources = new ExtraResources()

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    }
  })

  ipcMain.handle("get:extraResourcesPath", async () => extraResources.pathToCLIApp)

  mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, `/dist/bio-automation-angular/index.html`),
        protocol: "file:",
        slashes: true
      })
  );

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
