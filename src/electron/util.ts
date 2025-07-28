import { ipcMain, WebContents, WebFrameMain } from "electron";
import { pathToFileURL } from "url";
import { getUIPath } from "./pathResolvers.js";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function validateEventFrame(frame: WebFrameMain) {
  // Check if the event is from the dev server
  if (isDev() && new URL(frame.url).host === "localhost:5555") {
    return;
  }
  // Check if the event is from production
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("Invalid event frame.\nMalitious event detected.");
  }
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event) => {
    validateEventFrame(event.senderFrame!);
    return handler();
  });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}
