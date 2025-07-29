import { app, BrowserWindow } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManage.js";

import { getAppIconPath, getPreloadPath, getUIPath } from "./pathResolvers.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";

// Set the dock/taskbar icon (macOS)
if (process.platform === "darwin") {
  app.dock?.setIcon(getAppIconPath());
}

if (process.platform === "win32") {
  app.setAppUserModelId("com.mohamed-mdj.resource-monitor");
}

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 850,
    icon: getAppIconPath(),
    // frame: false,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5555");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  pollResources(mainWindow);
  ipcMainHandle("getStaticData", () => getStaticData());

  createTray(mainWindow);
  handleCloseEvents(mainWindow);

  createMenu(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;
  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });
  mainWindow.on("show", () => {
    willClose = false;
  });
}
