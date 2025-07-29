import osUtils from "os-utils";
import os from "os";
import fs from "fs";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "./util.js";

const POLLING_INTERVAL = 1000;
let lastStorageCheck = 0;
let cachedStorageData = { usage: 0, total: 0 };

export async function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const memoryUsage = await geteMemoryUsage();

    // Only check storage every 20 seconds to reduce unnecessary updates
    const now = Date.now();
    if (now - lastStorageCheck > 20000) {
      const storageData = getStoragedata();
      cachedStorageData = storageData;
      lastStorageCheck = now;
    }

    const data = {
      cpuUsage,
      memoryUsage,
      storageUsage: cachedStorageData.usage,
    };
    ipcWebContentsSend("statistics", mainWindow.webContents, data);
  }, POLLING_INTERVAL);
}

async function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    osUtils.cpuUsage((percent) => {
      resolve(percent);
    });
  });
}

async function geteMemoryUsage(): Promise<number> {
  return 1 - osUtils.freememPercentage();
}

function getStoragedata() {
  let totalSpace = 0;
  let totalFreeSpace = 0;

  if (process.platform === "win32") {
    const drives = getWindowsDrives();
    drives.forEach((drive) => {
      try {
        const stats = fs.statfsSync(drive);
        const total = stats.blocks * stats.bsize;
        const free = stats.bfree * stats.bsize;
        totalSpace += total;
        totalFreeSpace += free;
      } catch (error) {
        console.warn(`Could not access drive ${drive}:`, error);
      }
    });
  } else {
    // Unix-like systems: Get root filesystem
    try {
      const stats = fs.statfsSync("/");
      const total = stats.blocks * stats.bsize;
      const free = stats.bfree * stats.bsize;
      totalSpace = total;
      totalFreeSpace = free;
    } catch (error) {
      console.warn("Could not access root filesystem:", error);
    }
  }

  return {
    total: Math.round(totalSpace / 1024 / 1024 / 1024),
    usage: totalSpace > 0 ? 1 - totalFreeSpace / totalSpace : 0,
  };
}

function getWindowsDrives(): string[] {
  const drives: string[] = [];

  for (let i = 65; i <= 90; i++) {
    // ASCII A-Z
    const driveLetter = String.fromCharCode(i);
    const drivePath = `${driveLetter}:\\`;

    try {
      // Check if drive exists and is accessible
      fs.accessSync(drivePath, fs.constants.R_OK);
      drives.push(drivePath);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // skip
    }
  }

  return drives;
}

export function getStaticData() {
  const totalStorage = getStoragedata().total;
  const totalMemory = Math.floor(os.totalmem() / 1024 / 1024 / 1024);
  const cpuModel = os.cpus()[0].model;
  const platform = os.platform();
  const arch = os.arch();
  const cpuCores = os.cpus().length;
  const nodeVersion = navigator.userAgent;

  return {
    totalStorage,
    totalMemory,
    cpuModel,
    platform,
    cpuCores,
    arch,
    nodeVersion,
  };
}
