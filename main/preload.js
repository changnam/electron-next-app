const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, fn) => ipcRenderer.on(channel, (_, ...args) => fn(...args)),
});
