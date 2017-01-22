/*
 * This file is part of urite.
 *
 * urite is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * urite is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with urite.  If not, see <http://www.gnu.org/licenses/>.
 */

const {app, BrowserWindow, ipcMain} = require('electron');
const path     = require('path');
const url      = require('url');
const locale   = require('os-locale');
const settings = require('electron-settings');

let win;

/**
 * Sets up the method for creating the main window.
 *
 * @return  null
 */
function createWindow() {
  // Create windows parameters.
  win = new BrowserWindow({
    alwaysOnTop: true,
    kiosk: true,
    title: "urite",
    backgroundColor: "#f5f5f5",
    icon: "./images/icon.png",
    show: false
  });

  // Removes the Electron's native menu, since we wont use it.
  win.setMenu(null);

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Checks whether there is a user defined locale.
  settings.get('locale').then(val => {
    if ( typeof val === 'undefined' ) {
      locale().then( (locale) => {
        settings.set('locale', locale);
      });
    }
  });

  // Then load the splash page.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'splash.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Set the action when this window is closed.
  win.on('closed', () => {
    win = null;
  });

  // Sets a return value - null.
  return null;
}

/**
 * Loads the index page into an **already defined** BrowserWindow.
 *
 * @return  null
 */
function loadMainScreen() {
  // Loads the index/main page.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Sets a return value - null.
  return null;
}

function loadSingUpScreen() {
  // Loads the sign up page.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'signup.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Sets a return value - null.
  return null;
}

// When Electron is ready, creates our window.
app.on('ready', createWindow);

// When all windows were closed, we finish Electron.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Fix for clicking in the dock icon, on MacOS.
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

// Handles asynchronous messages.
ipcMain.on('asynchronous-message', (event, arg) => {
  if (arg === 'i18n-done') {
    // ============================================
    // Handles translation end on renderer process.
    // ============================================
    win.show();
  } else if (arg === 'splash-done') {
    // ==================================================
    // Checks whether there is a user configuration file.
    // ==================================================
    settings.get('name.first').then(val => {
      if ( typeof val === 'undefined' ) {
        // If there is no user configuration defined, loads the Sign Up screen.
        loadSingUpScreen();
      } else {
        // If the user is configured, closes the Splash and loads the Main screen.
        loadMainScreen();
      }
    });
  } else if (arg === 'signup-done') {
    // =============================================================================
    // After signing up the new user, we close the Sign Up screen and load the Main.
    // =============================================================================
    loadMainScreen();
  }
});
