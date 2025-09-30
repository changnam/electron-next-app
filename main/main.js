const { app, BrowserWindow } = require("electron");
const next = require("next");
const http = require("http");
const path = require("path");

let mainWindow;

const PORT = 3000;

async function createWindow() {
  const dev = !app.isPackaged;
  if (dev) {
    // Dev mode: don't start a server, just connect to the already running Next.js dev server

    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: { nodeIntegration: false },
    });
    mainWindow.loadURL(`http://localhost:${PORT}`);
    mainWindow.webContents.openDevTools();
    return;
  }

  // Production: start embedded Next.js server

  const nextApp = next({
    dev,
    dir: path.join(__dirname, ".."),
  });

  await nextApp.prepare();

  const handle = nextApp.getRequestHandler();
  const server = http.createServer((req, res) => handle(req, res));

  // Run on a local port
  //const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Next.js running at http://localhost:${PORT}`);
  });

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: false },
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
