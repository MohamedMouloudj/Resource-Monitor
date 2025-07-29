import fs from "fs";
import { app } from "electron";
import path from "path";

export function getPreloadPath() {
  return path.join(app.getAppPath(), "dist-electron", "preload.cjs");
}

export function getUIPath() {
  return path.join(app.getAppPath(), "dist-react", "index.html");
}

export function getAssetsPath(): string {
  const appPath = app.getAppPath();

  if (app.isPackaged) {
    const resourcesPath = path.join(process.resourcesPath, "src", "assets");
    const appAssetsPath = path.join(appPath, "src", "assets");

    // Check which path exists
    if (fs.existsSync(resourcesPath)) {
      return resourcesPath;
    } else if (fs.existsSync(appAssetsPath)) {
      return appAssetsPath;
    } else {
      // Fallback
      return path.join(appPath, "assets");
    }
  } else {
    // In development
    return path.join(appPath, "src", "assets");
  }
}

export function getAppIconPath(): string {
  const appPath = app.getAppPath();

  if (app.isPackaged) {
    if (process.platform === "win32") {
      return path.join(appPath, "app.ico");
    }
    return path.join(appPath, "app.png");
  } else {
    if (process.platform === "win32") {
      return path.join(appPath, "app.ico");
    }
    return path.join(appPath, "app.png");
  }
}
