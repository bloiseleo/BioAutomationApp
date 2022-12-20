const {app, BrowserWindow, ipcMain} = require('electron')
const url = require("url");
const path = require("path");
const {exec} = require("child_process")
const ExtraResources = require("./config/ExrtaResources.js");
const { stderr } = require('process');
const extraResources = new ExtraResources()

let mainWindow

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if(error) {
        return reject(error)
      }
      return resolve({stdout, stderr})
    })
  })
}

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
  ipcMain.handle("make:uploadDocument", async (_, data) => {
    const {pathToCLIApp} = extraResources;
    const command = `${pathToCLIApp} create-workspace --name="${data['workspaceName']}" --refseq="${data['refseq']}" --file="${data['file']}"`
    return execCommand(command)
    .then(data => {
      console.log(data)
      if(data['stderr'] != "") {
        console.error(stderr)
        return false;
      }
      return true;
    })
  })

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
