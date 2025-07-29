import path from "path";
import { app, BrowserWindow, Menu, Tray } from "electron";
import { getAssetsPath } from "./pathResolvers.js";

export function createTray(mainWindow: BrowserWindow) {
  const tray = new Tray(
    path.join(
      getAssetsPath(),
      process.platform === "darwin"
        ? "/trayIconTemplate.png"
        : "/trayIcon@2x.png"
    )
  );

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => {
        mainWindow.show();
        if (app.dock) {
          app.dock.show();
        }
      },
    },
    {
      type: "separator",
      visible: true,
    },
    {
      label: "Quit",
      click: () => app.quit(),
    },
  ]);

  if (process.platform === "win32") {
    contextMenu.items.forEach((item) => {
      if (item.type === "normal") {
        item.label = item.label?.trim();
      }
    });
  }

  tray.setContextMenu(contextMenu);
  tray.setToolTip("Resource Monitor");

  return tray;
}
