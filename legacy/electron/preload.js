const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('lifequest', {
  version: 'desktop-dev',
});
