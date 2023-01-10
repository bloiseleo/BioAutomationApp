const {app, BrowserWindow, ipcMain} = require('electron')
const url = require("url");
const path = require("path");
const {exec} = require("child_process")
const ExtraResources = require("./config/ExrtaResources.js");
const { stderr } = require('process');
const { pathToIcon } = require('../Constants.js');
const extraResources = new ExtraResources(false)

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
    icon: pathToIcon,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    },
    title: "BioAutomation",
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: "#1E4C82",
      symbolColor: "#FFFFFF"
    }
  })

  ipcMain.handle("get:extraResourcesPath", async () => extraResources.pathToCLIApp)
  ipcMain.handle("make:uploadDocument", async (_, data) => {
    const {pathToCLIApp} = extraResources;
    const command = `"${pathToCLIApp}" create-workspace --name="${data['workspaceName']}" --refseq="${data['refseq']}" --file="${data['file']}" --protein_sequence="${data['proteinSequence']}" --protein_header="${data['proteinHeader']}"`
    return execCommand(command)
    .then(data => {
      if(data['stderr'] != "") {
        console.error(stderr)
        return false;
      }
      return true;
    })
  })
  ipcMain.handle("get:allWorkspaces", async (event) => {
    const {pathToCLIApp} = extraResources;
    const command = `"${pathToCLIApp}" list-all-workspaces`
    return execCommand(command)
    .then(data => {
      if(data['stderr'] != "") {
        console.error(stderr)
        return false;
      }
      return data['stdout']
    })
  })
  ipcMain.handle("get:workspace", async (_, data) => {
    const {workspaceName} = data;
    const {pathToCLIApp} = extraResources;
    const command = `"${pathToCLIApp}" get-workspace --name="${workspaceName}"`
    return execCommand(command)
    .then(data => {
      if(data['stderr'] != "") {
        console.error(stderr)
        return false;
      }
      return Boolean(Number(data['stdout']))
    })
  })
  ipcMain.handle("processEntry:predictSNP", async (_, data) => {
    const {pathToCLIApp} = extraResources;
    const {workspaceName} = data;
    const command = `"${pathToCLIApp}" predict-snp-entry --name="${workspaceName}"`
    return execCommand(command)
    .then(data => {
      if(data['stderr'] != "") {
        console.error(stderr)
        return false;
      }
      return true;
    })
  })
  ipcMain.handle("processOut:predictSNP", async (_, data) => {
    const {pathToCLIApp} = extraResources;
    const {workspaceName, resultFile} = data;
    const command = `"${pathToCLIApp}" predict-snp-out --name="${workspaceName}" --result_file="${resultFile}"`;
    return execCommand(command)
    .then(data => {
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
