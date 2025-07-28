const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeToResourceStats: (callback) => {
    return ipcOn("statistics", (stats) => callback(stats));
  },
  getStaticData: () => ipcInvoke("getStaticData"),
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const listenerFunction = (_: any, payload: EventPayloadMapping[Key]) =>
    callback(payload);
  electron.ipcRenderer.on(key, listenerFunction);
  return () => electron.ipcRenderer.off(key, listenerFunction);
}
