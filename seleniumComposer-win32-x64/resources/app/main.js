const electron = require('electron');
const path = require('path');
const glob = require('glob');
const selenium = require('./assets/js/selenium/selenium.js');
const spawn = require('child_process').spawn;
const terminal = require('./assets/js/terminal.js');

const BrowserWindow = electron.BrowserWindow;
const app = electron.app;

if (process.mas) app.setName('SeleniumComposer');

var mainWindow = null

function initialize () {
  var shouldQuit = makeSingleInstance();
  if (shouldQuit) return app.quit();


  function createWindow () {
    var windowOptions = {
      width: 1000,  
      minWidth: 680,
      height: 1040,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true,
        webSecurity: true,
        preload: path.resolve(path.join(__dirname, 'assets/js/preload.js'))
      },
    };
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }

  app.on('ready', function () {
    createWindow();
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-proces
function loadDemos () {
  var files = glob.sync(path.join(__dirname, 'assets/js/*.js'))
  files.forEach(function (file) {
    require(file)
  })
  autoUpdater.updateMenu()
}

initialize();











