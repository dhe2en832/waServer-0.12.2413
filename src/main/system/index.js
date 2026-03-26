const fs = require("fs");
const path = require("path");
const ini = require("ini");

// Use process.cwd() instead of electron app
const rootPath = process.cwd();
const config = ini.parse(
  fs.readFileSync(path.resolve(rootPath + "/wacsa.ini"), "utf-8")
);
const versionTag = "v0.12.2413";

const updateListener = (win) => {
  // Update listener logic here

  autoUpdater.on("update-available", (info) => {
    win.webContents.send("update_available", info);
  });

  autoUpdater.on("update-not-available", (info) => {
    win.webContents.send("update_not_available", info);
  });

  autoUpdater.on("update-downloaded", () => {
    win.webContents.send("update_downloaded");
  });

  ipcMain.on("check-for-update", () => {
    autoUpdater.checkForUpdates().catch(() => {});
  });

  ipcMain.on("download-update", () => {
    autoUpdater.downloadUpdate();
  });

  ipcMain.on("restart-for-update", () => {
    autoUpdater.quitAndInstall();
  });
};

module.exports = {
  rootPath,
  config,
  versionTag,
  updateListener,
};
