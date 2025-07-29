import { app, BrowserWindow, Menu } from "electron";
import { isDev } from "./util.js";

export function createMenu(mainWindow: BrowserWindow) {
  // Track fullscreen state to avoid race conditions
  let isFullScreen = false;
  mainWindow.on("enter-full-screen", () => {
    isFullScreen = true;
  });
  mainWindow.on("leave-full-screen", () => {
    isFullScreen = false;
  });

  let showAppMenu = false;

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: process.platform === "darwin" ? undefined : "App",
        type: "submenu",
        submenu: [
          {
            label: "Hide",
            click: () => mainWindow.hide(),
            accelerator: "CmdOrCtrl+H",
          },
          {
            label: "Quit",
            click: () => app.quit(),
            accelerator: "CmdOrCtrl+Q",
          },
          {
            label: "",
            accelerator: "Alt+F4",
            visible: false,
            click: () => app.quit(),
          },
        ],
      },
      {
        label: "View",
        type: "submenu",
        submenu: [
          {
            label: "Toggle Full Screen",
            click: () => {
              // Use our tracked state instead of querying isFullScreen() , because of macOS
              mainWindow.setFullScreen(!isFullScreen);
            },
            accelerator: "F11",
          },
          {
            label: "",
            visible: false,
            click: () => {
              // Use our tracked state instead of querying isFullScreen() , because of macOS
              mainWindow.setFullScreen(false);
            },
            accelerator: "Escape",
          },
          {
            label: "Toggle App Menu",
            type: "checkbox",
            checked: showAppMenu,
            click: () => {
              showAppMenu = !showAppMenu;
              mainWindow.setMenuBarVisibility(!showAppMenu);
            },
            accelerator: "CmdOrCtrl+M",
          },
          {
            type: "separator",
          },
          {
            label: "DevTools",
            click: () => mainWindow.webContents.openDevTools(),
            accelerator: "CmdOrCtrl+Shift+C",
            visible: isDev(),
          },
        ],
      },
    ])
  );
}
