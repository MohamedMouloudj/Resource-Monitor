import osUtils from "os-utils";
import os from "os";
import fs from "fs";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "./util.js";

const POLLING_INTERVAL = 1000;

export async function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const memoryUsage = await geteMemoryUsage();
    const storageData = getStoragedata();
    const data = {
      cpuUsage,
      memoryUsage,
      storageUsage: storageData.usage,
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
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.blocks * stats.bsize;
  const free = stats.bfree * stats.bsize;
  return {
    total: Math.round(total / 1024 / 1024 / 1024),
    usage: 1 - free / total,
  };
}

export function getStaticData() {
  const totalStorage = getStoragedata().total;
  const totalMemory = Math.floor(os.totalmem() / 1024 / 1024 / 1024);
  const cpuModel = os.cpus()[0].model;

  return {
    totalStorage,
    totalMemory,
    cpuModel,
  };
}
