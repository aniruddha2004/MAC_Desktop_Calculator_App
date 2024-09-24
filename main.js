const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400, // Initial width
    height: 550, // Initial height
    minHeight: 550, // Minimum height allowed
    maxHeight: 650, // Maximum height allowed
    resizable: true, // Allow resizing
    movable: true, // Ensure the window can be moved
    frame: true, // Use default frame, or set to false if using custom frame
    // useContentSize: true, // Ensure content size is used for window dimensions
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  mainWindow.setMenu(null); // Remove default menu bar

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));

  // Uncomment to open the DevTools.
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
