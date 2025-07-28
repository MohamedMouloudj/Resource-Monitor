import { app, BrowserWindow } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManage.js";

import { getPreloadPath, getUIPath } from "./pathResolvers.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
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
});
