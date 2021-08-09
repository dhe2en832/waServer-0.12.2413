const path = require('path');
const url = require('url');
const { contextBridge } = require('electron/renderer');
const customTitlebar = require('custom-electron-titlebar');
const { ipcRenderer } = require('electron/renderer');
const { home } = require('./pages/home');
const { login } = require('./pages/login');

contextBridge.exposeInMainWorld('WACSA_UI', {
  titleBarSys: () => {
    new customTitlebar.Titlebar({
      backgroundColor: customTitlebar.Color.fromHex('#007bff'),
      icon: url.format(path.join(__dirname, '../images/icon.ico')),
      menu: null,
      maximizable: false,
    });

    const replaceText = (selector, text) => {
      const element = document.getElementById(selector);
      if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type]);
    }
  },
  mainSys: () => {
    const wrapperElm = document.querySelector('main');
    const alertOnlineStatus = () => {
      navigator.onLine
        ? console.log('Anda sedang terkoneksi internet...')
        : window.alert(
            'Anda sedang offline. Silahkan koneksikan internet anda dan buka ulang aplikasi ini..!'
          );
    };
    ipcRenderer.on('dom-loaded', (event, port) => {
      window.addEventListener('online', alertOnlineStatus());
      window.addEventListener('offline', alertOnlineStatus());
      const base_url = 'http://localhost:' + port;
      if (JSON.parse(localStorage.getItem('sessionID'))) home(ipcRenderer, wrapperElm);
      else login(ipcRenderer, wrapperElm, base_url, home);
    });
  },
});
