const { app, BrowserWindow } = require('electron');

console.log('App object:', app);
console.log('BrowserWindow:', BrowserWindow);

app.whenReady().then(() => {
  console.log('Electron is ready!');
  app.quit();
});
