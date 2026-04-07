1. Electron cria a BrowserWindow
        │
        ▼
  2. Electron vê que tem um preload configurado:
        webPreferences: {
          preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
        }
        │
        ▼
  3. Electron executa preload.ts ANTES de carregar o HTML
        │
        ▼
  4. preload.ts roda:
        contextBridge.exposeInMainWorld('api', {
          startFocus: () => ipcRenderer.send('timer:start-focus'),
          onTimerTick: (cb) => ipcRenderer.on('timer:tick', ...),
        })
        │
        ▼
  5. O Electron pega esse objeto e GRUDA no window do renderer:
        window.api = {
          startFocus: [função],
          onTimerTick: [função],
        }
        │
        ▼
  6. Agora sim o HTML carrega → renderer.tsx executa → App.tsx monta
        │
        ▼
  7. App.tsx faz window.api.startFocus()  ← já existe, foi injetado no passo 5