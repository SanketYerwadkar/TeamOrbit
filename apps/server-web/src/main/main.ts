import path from 'path';
import { app, ipcMain, Tray, dialog, BrowserWindow, shell, Menu } from 'electron';
import { DesktopServer } from './helpers/desktop-server';
import { LocalStore } from './helpers/services/libs/desktop-store';
import { EventEmitter } from 'events';
import { defaultTrayMenuItem, _initTray, updateTrayMenu } from './tray';
import { EventLists, SettingPageTypeMessage, ServerPageTypeMessage, LOG_TYPES, IPC_TYPES } from './helpers/constant';
import { resolveHtmlPath } from './util';
import Updater from './updater';
import { mainBindings } from 'i18next-electron-fs-backend';
import i18nextMainBackend from '../configs/i18n.mainconfig';
import fs from 'fs';
import { WebServer, AppMenu, ServerConfig } from './helpers/interfaces';
import { clearDesktopConfig } from './helpers';
import Log from 'electron-log';
import MenuBuilder from './menu';
import { config } from '../configs/config';
import { debounce } from 'lodash';


console.log = Log.log;
Object.assign(console, Log.functions);


app.name = config.DESCRIPTION;

const eventEmitter = new EventEmitter();

const controller = new AbortController();
const { signal } = controller;
const isPack = app.isPackaged;
const desktopServer = new DesktopServer(false, eventEmitter);
const isProd = process.env.NODE_ENV === 'production';

// const appPath = app.getAppPath();

let isServerRun: boolean;
let intervalUpdate: NodeJS.Timeout;
let tray: Tray;
let settingWindow: BrowserWindow | null = null;
let logWindow: BrowserWindow | null = null;
let setupWindow: BrowserWindow | any = null;
const appMenu = new MenuBuilder(eventEmitter)

Log.hooks.push((message: any, transport) => {
  if (transport !== Log.transports.file) {
    return message;
  }

  // if (message[0]) {
  //   message[0] = `LOGS - ${message[0]}`
  // }

  message.data = message.data.map((i: any) => {
    if (typeof i === 'object') {
      return JSON.stringify(i)
    }
    return i;
  })

  if (message.data[0] === LOG_TYPES.SERVER_LOG) {
    if (logWindow) {
      const msg = message.data.join(' ');
      logWindow.webContents.send(IPC_TYPES.SERVER_PAGE, {
        type: LOG_TYPES.SERVER_LOG,
        msg
      });
    }
  }

  if (message.data[0] === LOG_TYPES.UPDATE_LOG) {
    if (settingWindow) {
      const msg = `${message.data.join(' ')}`;
      settingWindow.webContents.send(IPC_TYPES.UPDATER_PAGE, {
        type: LOG_TYPES.UPDATE_LOG,
        msg
      })
    }
  }


  return message;
})

const updater = new Updater(eventEmitter, i18nextMainBackend);
i18nextMainBackend.on('initialized', () => {
  const config = LocalStore.getStore('config');
  const selectedLang = config && config.general && config.general.lang;
  i18nextMainBackend.changeLanguage(selectedLang || 'en');
  i18nextMainBackend.off('initialized'); // Remove listener to this event as it's not needed anymore
});

let trayMenuItems: any = [];
let appMenuItems: AppMenu[] = [];

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

console.log(__dirname);

if (isProd) {
  // serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')}`)
}

const resourceDir = {
  webServer: !isPack ? '../../release/app/dist' : '.',
  resources: '../resources'
};
const resourcesFiles = {
  webServer: 'standalone/apps/web/server.js',
  iconTray: 'icons/icon.png'
}

const devServerPath = path.join(__dirname, resourceDir.webServer, resourcesFiles.webServer);
const serverPath = isPack ? path.join(process.resourcesPath, 'release', 'app', 'dist', resourcesFiles.webServer) : devServerPath;



if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};


const createWindow = async (type: 'SETTING_WINDOW' | 'LOG_WINDOW' | 'SETUP_WINDOW') => {
  if (isDebug) {
    await installExtensions();
  }

  const defaultOptionWindow = {
    title: app.name,
    frame: true,
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icons/icon.png'),
    maximizable: false,
    resizable: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  }
  let url = '';
  switch (type) {
    case 'SETTING_WINDOW':
      settingWindow = new BrowserWindow(defaultOptionWindow);
      url = resolveHtmlPath('index.html', 'setting');
      settingWindow.loadURL(url);

      mainBindings(ipcMain, settingWindow, fs);
      settingWindow.on('closed', () => {
        settingWindow = null;
      });
      Menu.setApplicationMenu(appMenu.buildDefaultTemplate(appMenuItems, i18nextMainBackend))
      break;
    case 'LOG_WINDOW':
      logWindow = new BrowserWindow(defaultOptionWindow);
      url = resolveHtmlPath('index.html', 'history-console')
      logWindow.loadURL(url);
      mainBindings(ipcMain, logWindow, fs);
      logWindow.on('closed', () => {
        logWindow = null;
      })
      Menu.setApplicationMenu(appMenu.buildDefaultTemplate(appMenuItems, i18nextMainBackend))
      break;
    case 'SETUP_WINDOW':
      setupWindow = new BrowserWindow(defaultOptionWindow);
      url = resolveHtmlPath('index.html', 'setup');
      setupWindow?.loadURL(url);
      mainBindings(ipcMain, setupWindow, fs);
      if (process.platform === 'darwin') {
        Menu.setApplicationMenu(Menu.buildFromTemplate([]));
      } else {
        setupWindow.removeMenu();
      }
      setupWindow.on('closed', () => {
        setupWindow = null;
      })
      break;
    default:
      break;
  }
};

const runServer = async () => {
  console.log('Run the Server...');
  try {
    const envVal: ServerConfig | undefined = getEnvApi();
    const folderPath = getWebDirPath();
    await clearDesktopConfig(folderPath);

    // Instantiate API and UI servers
    await desktopServer.start(
      { api: serverPath },
      {
        ...(envVal || {}),
        IS_DESKTOP_APP: true
      },
      undefined,
      signal
    );
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('You exit without to stop the server');
      return;
    }
  }
};

const stopServer = async () => {
  await desktopServer.stop();
};

const restartServer = async () => {
  await desktopServer.stop();
  const waitingForServerStop = setInterval(async () => {
    if (!isServerRun) {
      clearInterval(waitingForServerStop);
      await runServer()
    }
  }, 1000)
}

const getEnvApi = (): ServerConfig | undefined => {
  const setting: WebServer = LocalStore.getStore('config')
  return setting?.server;
};

const SendMessageToSettingWindow = (type: string, data: any) => {
  settingWindow?.webContents.send('setting-page', {
    type,
    data
  });
}

const onInitApplication = () => {
 // check and set default config
  const storeConfig:WebServer = LocalStore.getStore('config');
  i18nextMainBackend.on('languageChanged', debounce((lng) => {
    if (i18nextMainBackend.isInitialized && storeConfig.general?.setup) {
      trayMenuItems = trayMenuItems.length ? trayMenuItems : defaultTrayMenuItem(eventEmitter);
      updateTrayMenu('none', {}, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
      Menu.setApplicationMenu(appMenu.buildDefaultTemplate(appMenuItems, i18nextMainBackend))
    }
  }, 250));

  eventEmitter.on(EventLists.webServerStop, async () => {
    await stopServer();
    isServerRun = false;
  })

  eventEmitter.on(EventLists.RESTART_SERVER, async () => {
    await restartServer();
  })

  eventEmitter.on(EventLists.webServerStarted, () => {
    console.log(EventLists.webServerStarted)
    updateTrayMenu('SERVER_START', { enabled: false }, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
    updateTrayMenu('SERVER_STOP', { enabled: true }, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
    updateTrayMenu('OPEN_WEB', { enabled: true }, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
    updateTrayMenu('SERVER_STATUS', { label: 'MENU.SERVER_STATUS_STARTED' }, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
    if (logWindow) {
      logWindow.webContents.send(IPC_TYPES.SERVER_PAGE, {
        type: ServerPageTypeMessage.SERVER_STATUS,
        data: {
          isRun: true
        }
      })
    }
    isServerRun = true;
  })

  eventEmitter.on(EventLists.webServerStopped, () => {
    console.log(EventLists.webServerStopped);
    updateTrayMenu('SERVER_STOP', { enabled: false }, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
    updateTrayMenu('SERVER_START', { enabled: true }, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
    updateTrayMenu('OPEN_WEB', { enabled: false }, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
    updateTrayMenu('SERVER_STATUS', { label: 'MENU.SERVER_STATUS_STOPPED' }, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
    if (logWindow) {
      logWindow.webContents.send(IPC_TYPES.SERVER_PAGE, {
        type: ServerPageTypeMessage.SERVER_STATUS,
        data: {
          isRun: false
        }
      })
    }
    isServerRun = false;
  })

  eventEmitter.on(EventLists.gotoSetting, async () => {
    if (!settingWindow) {
      await createWindow('SETTING_WINDOW');
    }
    const serverSetting: WebServer = LocalStore.getStore('config');
    console.log('setting data', serverSetting);
    settingWindow?.show();
    settingWindow?.webContents.once('did-finish-load', () => {
      setTimeout(() => {
        settingWindow?.webContents.send('languageSignal', serverSetting.general?.lang);
        SendMessageToSettingWindow(SettingPageTypeMessage.loadSetting, serverSetting);
      }, 50)
    })
  })

  eventEmitter.on(EventLists.UPDATE_AVAILABLE, (data) => {
    console.log(LOG_TYPES.UPDATE_LOG, 'UPDATE_AVAILABLE', data);
    SendMessageToSettingWindow(SettingPageTypeMessage.updateAvailable, data);
  })

  eventEmitter.on(EventLists.UPDATE_ERROR, (data) => {
    console.log(LOG_TYPES.UPDATE_LOG, 'UPDATE_ERROR', data);
    SendMessageToSettingWindow(SettingPageTypeMessage.updateError, { message: JSON.stringify(data) });
  })

  eventEmitter.on(EventLists.UPDATE_NOT_AVAILABLE, (data) => {
    console.log(LOG_TYPES.UPDATE_LOG, 'UPDATE_NOT_AVAILABLE', data);
    SendMessageToSettingWindow(SettingPageTypeMessage.upToDate, data);
  })

  eventEmitter.on(EventLists.UPDATE_PROGRESS, (data) => {
    console.log(LOG_TYPES.UPDATE_LOG, 'UPDATE_PROGRESS', data.percent);
    SendMessageToSettingWindow(SettingPageTypeMessage.downloadingUpdate, { percent: Math.floor(data.percent || 0) });
  })

  eventEmitter.on(EventLists.UPDATE_DOWNLOADED, (data) => {
    console.log(LOG_TYPES.UPDATE_LOG, 'UPDATE_DOWNLOADED', data);
    SendMessageToSettingWindow(SettingPageTypeMessage.downloaded, data);
  })

  eventEmitter.on(EventLists.UPDATE_CANCELLED, (data) => {
    console.log(LOG_TYPES.UPDATE_LOG, 'UPDATE_CANCELLED', data);
    SendMessageToSettingWindow(SettingPageTypeMessage.updateCancel, data);
  })

  eventEmitter.on(EventLists.CHANGE_LANGUAGE, (data) => {
    i18nextMainBackend.changeLanguage(data.code);
    LocalStore.updateConfigSetting({
      general: {
        lang: data.code
      }
    })
  })

  eventEmitter.on(EventLists.CHANGE_THEME, (data) => {
    LocalStore.updateConfigSetting({
      general: {
        theme: data
      }
    })
    logWindow?.webContents.send('themeSignal', { type: SettingPageTypeMessage.themeChange, data });
    settingWindow?.webContents.send('themeSignal', { type: SettingPageTypeMessage.themeChange, data });
  })

  eventEmitter.on(EventLists.gotoAbout, async () => {
    if (!settingWindow) {
      await createWindow('SETTING_WINDOW');
    }
    const serverSetting = LocalStore.getStore('config');
    settingWindow?.show();
    settingWindow?.webContents.once('did-finish-load', () => {
      setTimeout(() => {
        SendMessageToSettingWindow(SettingPageTypeMessage.loadSetting, serverSetting);
        settingWindow?.webContents.send('languageSignal', serverSetting.general?.lang);
        SendMessageToSettingWindow(SettingPageTypeMessage.selectMenu, { key: 'about' });
      }, 100)
    })
  })

  eventEmitter.on(EventLists.SERVER_WINDOW, async () => {
    if (!logWindow) {
      initTrayMenu()
      await createWindow('LOG_WINDOW');
    }
    const serverSetting = LocalStore.getStore('config');
    logWindow?.show();
    logWindow?.webContents.once('did-finish-load', () => {
      setTimeout(() => {
        logWindow?.webContents.send('languageSignal', serverSetting.general?.lang);
        // SendMessageToSettingWindow(SettingPageTypeMessage.selectMenu, { key: 'about' });
        logWindow?.webContents.send(IPC_TYPES.SERVER_PAGE, {
          type: ServerPageTypeMessage.SERVER_STATUS,
          data: {
            isRun: isServerRun
          }
        })
      }, 100)
    })
  })

  eventEmitter.on(EventLists.OPEN_WEB, () => {
    const envConfig: ServerConfig | undefined = getEnvApi();
    const url = `http://127.0.0.1:${envConfig?.PORT}`
    shell.openExternal(url)
  })

  eventEmitter.on(EventLists.SETTING_WINDOW_DEV, () => {
    settingWindow?.webContents.toggleDevTools();
  })

  eventEmitter.on(EventLists.SERVER_WINDOW_DEV, () => {
    logWindow?.webContents.toggleDevTools();
  })
}

const initTrayMenu = () => {
  const MAX_RETRIES = 2;
  const retryInit = async (attempts: number = 0) => {
    try {
      LocalStore.setDefaultServerConfig();
      createIntervalAutoUpdate()
      trayMenuItems = trayMenuItems.length ? trayMenuItems : defaultTrayMenuItem(eventEmitter);
      appMenuItems = appMenuItems.length ? appMenuItems : appMenu.defaultMenu();
      tray = _initTray(trayMenuItems, getAssetPath('icons/icon.png'));

      eventEmitter.on(EventLists.webServerStart, async () => {
        updateTrayMenu('SERVER_START', { enabled: false }, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
        isServerRun = true;
        await runServer();
      })

      trayMenuItems = trayMenuItems.length ? trayMenuItems : defaultTrayMenuItem(eventEmitter);
      updateTrayMenu('none', {}, eventEmitter, tray, trayMenuItems, i18nextMainBackend);
    } catch (error) {
      if (attempts < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        retryInit(attempts + 1)
      }
      console.error('Failed to initialize application:', error);
      dialog.showErrorBox('Initialization Error', 'Failed to initialize application');
    }
  }
  if (!tray) {
    return retryInit(0)
  }
}

(async () => {
  await app.whenReady()
  const storeConfig:WebServer = LocalStore.getStore('config');
  onInitApplication();
  if (storeConfig?.general?.setup) {
    eventEmitter.emit(EventLists.SERVER_WINDOW);
  } else {
    if (!setupWindow) {
      await createWindow('SETUP_WINDOW');
    }
    if (setupWindow) {
      setupWindow?.show();
      setupWindow?.webContents.once('did-finish-load', () => {
        setTimeout(() => {
          setupWindow?.webContents.send('languageSignal', storeConfig.general?.lang);
        }, 50)
      })
    }
  }
})()

app.on('window-all-closed', () => {
  // e.preventDefault()
  // app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

const getWebDirPath = () => {
  const dirFiles = 'standalone/apps/web/.next/server/app/api';
  const devDirFilesPath = path.join(__dirname, resourceDir.webServer, dirFiles);
  const packDirFilesPath = path.join(process.resourcesPath, 'release', 'app', 'dist', dirFiles)
  const diFilesPath = isPack ? packDirFilesPath : devDirFilesPath;
  return diFilesPath;
}

ipcMain.on(IPC_TYPES.SETTING_PAGE, async (event, arg) => {
  switch (arg.type) {
    case SettingPageTypeMessage.saveSetting:
      {
        LocalStore.updateConfigSetting({
          server: arg.data
        });
        const diFilesPath = getWebDirPath();
        await clearDesktopConfig(
          diFilesPath
        )
        if (arg.isSetup) {
          LocalStore.updateConfigSetting({
            general: {
              setup: true
            }
          });
          setupWindow?.close();
          eventEmitter.emit(EventLists.SERVER_WINDOW);
        } else {
          event.sender.send(IPC_TYPES.SETTING_PAGE, {
            type: SettingPageTypeMessage.mainResponse, data: {
              status: true,
              isServerRun: isServerRun
            }
          });
        }
        break;
      }
      case SettingPageTypeMessage.checkUpdate:
      updater.checkUpdate();
      break;
    case SettingPageTypeMessage.installUpdate:
      updater.installUpdate();
      break;
    case SettingPageTypeMessage.showVersion:
      const currentVersion = app.getVersion();
      event.sender.send(IPC_TYPES.SETTING_PAGE, { type: SettingPageTypeMessage.showVersion, data: currentVersion })
      break;
    case SettingPageTypeMessage.langChange:
      event.sender.send('languageSignal', arg.data);
      eventEmitter.emit(EventLists.CHANGE_LANGUAGE, { code: arg.data })
      break;
    case SettingPageTypeMessage.restartServer:
      eventEmitter.emit(EventLists.RESTART_SERVER)
      break;
    case SettingPageTypeMessage.themeChange:
      eventEmitter.emit(EventLists.CHANGE_THEME, arg.data)
      break;
    case SettingPageTypeMessage.updateSetting:
      LocalStore.updateConfigSetting({
        general: {
          autoUpdate: arg.data.autoUpdate,
          updateCheckPeriod: arg.data.updateCheckPeriod
        }
      })
      createIntervalAutoUpdate()
      event.sender.send(IPC_TYPES.UPDATER_PAGE, { type: SettingPageTypeMessage.updateSettingResponse, data: true })
      break;
    default:
      break;
  }
})

ipcMain.on(IPC_TYPES.SERVER_PAGE, (_, arg) => {
  switch (arg.type) {
    case ServerPageTypeMessage.SERVER_EXEC:
      if (arg.data.isRun) {
        eventEmitter.emit(EventLists.webServerStart)
      } else {
        eventEmitter.emit(EventLists.webServerStop)
      }
      break;

    default:
      break;
  }
})

ipcMain.handle('current-theme', async () => {
  const setting: WebServer = LocalStore.getStore('config');
  return setting?.general?.theme;;
})

ipcMain.handle('current-language', async (): Promise<string> => {
  const setting: WebServer = LocalStore.getStore('config');
  return setting?.general?.lang || 'en';
})

const createIntervalAutoUpdate = () => {
  if (intervalUpdate) {
    clearInterval(intervalUpdate)
  }
  const setting: WebServer = LocalStore.getStore('config');
  if (setting.general?.autoUpdate && setting.general.updateCheckPeriod) {
    const checkIntervalSecond = parseInt(setting.general.updateCheckPeriod);
    if (!Number.isNaN(checkIntervalSecond)) {
      const intervalMS = checkIntervalSecond * 60 * 1000;
      intervalUpdate = setInterval(() => {
        updater.checkUpdateNotify();
      }, intervalMS)
    }
  }
}


app.on('before-quit', async (e) => {
  console.log('Before Quit');

  e.preventDefault();

  if (isServerRun) {
    const exitConfirmationDialog = await dialog.showMessageBox({
      message: '',
      title: i18nextMainBackend.t('MESSAGE.WARNING'),
      detail: i18nextMainBackend.t('MESSAGE.EXIT_MESSAGE'),
      buttons: [
        i18nextMainBackend.t('FORM.BUTTON.YES'),
        i18nextMainBackend.t('FORM.BUTTON.NO')
      ]
    })

    if (exitConfirmationDialog.response === 0) {
      // Stop the server from main
      stopServer();
    }
  } else {
    app.exit(0);
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (mainWindow === null) createWindow();
});