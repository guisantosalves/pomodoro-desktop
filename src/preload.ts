/*
Pra mandar dados do main process (onde o timer roda) pro renderer (HTML), o Electron usa IPC (Inter-Process
Communication) que é uma forma de enviar mensagens entre os processos. O preload.ts é um arquivo que é carregado
antes do renderer process ser criado, e é onde você pode expor funções ou variáveis para o renderer process usando a API de contexto seguro do Electron.
*/

/*
  - webContents.send() — main envia mensagem pro renderer
  - ipcRenderer.on() — renderer ouve mensagens do main
  - contextBridge — expõe ipcRenderer.on de forma segura via window.api, sem dar acesso direto ao Node pro renderer

  O renderer nunca tem acesso direto ao Node/Electron. Tudo passa pelo preload.ts, que é a "janelinha de atendimento" entre os dois mundos.
*/

// tudo passa por aqui
import { contextBridge, ContextBridge, ipcRenderer } from "electron";

type Tick = (state: string, remaining: number) => void;

// I can use as window.api
contextBridge.exposeInMainWorld("api", {
  //webContents.send + ipcRenderer.on │ Main → Renderer │ Dados
  onTimerTick: (callback: Tick) => {
    ipcRenderer.on("timer:tick", (_event, state, remaining) => {
      callback(state, remaining);
    });
  },

  // ipcRenderer.send + ipcMain.on     │ Renderer → Main │ Ações
  startFocus: () => ipcRenderer.send("timer:start-focus"),
  stopTimer: () => ipcRenderer.send("timer:stop"),
  startBreak: () => ipcRenderer.send("timer:start-break"),

  // config
  setDurations: (focus: number, breakTimer: number) =>
    ipcRenderer.invoke("config:set-durations", focus, breakTimer),
  getDurations: () => ipcRenderer.invoke("config:get-durations"),
});
