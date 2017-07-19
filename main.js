const { app } = require('electron');

require('electron-debug')({ showDevTools: true });

const { createKeyboardProcess } = require('./client/keyboard');
const { createSettingsProcess, toggleSettings } = require('./client/settings');
const { createTouchBarProcess, renderTouchBar } = require('./client/touchbar');
const { createTrayProcess } = require('./client/tray');

app.dock.hide();

app.once('ready', () => {
    let tray = createTrayProcess(toggleSettings);
    let touchBar = createTouchBarProcess();
    let settings = createSettingsProcess(touchBar, tray);
    createKeyboardProcess(touchBar);

    renderTouchBar();
});

app.on('window-all-closed', () => {
    app.quit()
});
