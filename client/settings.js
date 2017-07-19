const { BrowserWindow } = require('electron');

module.exports = {
    createSettingsProcess,
    toggleSettings
};

let SETTING_PROCESS;
let TOUCH_BAR_PROCESS;
let TRAY_PROCESS;

function createSettingsProcess (touchbarProcess, trayProcess) {
    TOUCH_BAR_PROCESS = touchbarProcess;
    TRAY_PROCESS = trayProcess;
    SETTING_PROCESS = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        alwaysOnTop: true
    });

    SETTING_PROCESS.loadURL('file://' + process.cwd() + '/index.html');

    SETTING_PROCESS.on('focus', () => {
        TOUCH_BAR_PROCESS.show();
    });
    SETTING_PROCESS.on('show', () => {
        TRAY_PROCESS.setHighlightMode('always');
        TOUCH_BAR_PROCESS.show();
    });
    SETTING_PROCESS.on('hide', () => {
        TRAY_PROCESS.setHighlightMode('never');
        TOUCH_BAR_PROCESS.hide();
    });

    return SETTING_PROCESS;
}

function toggleSettings (toggle) {
    if (toggle || !SETTING_PROCESS.isVisible()) {
        _showSettings();
    } else {
        SETTING_PROCESS.hide();
    }
}

function _getSettingsPosition () {
    let settingsBounds = SETTING_PROCESS.getBounds();
    let trayBounds = TRAY_PROCESS.getBounds();

    let x = Math.round(trayBounds.x + (trayBounds.width / 2) - (settingsBounds.width / 2));
    let y = Math.round(trayBounds.y + trayBounds.height + 4);

    return { x, y };
}

function _showSettings () {
    let position = _getSettingsPosition();
    SETTING_PROCESS.setPosition(position.x, position.y, false);
    SETTING_PROCESS.show();
}
