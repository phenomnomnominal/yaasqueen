const { app, globalShortcut } = require('electron');

module.exports = {
    createKeyboardProcess
};

function createKeyboardProcess (TOUCH_BAR_PROCESS) {
    globalShortcut.register('Cmd+Shift+Y', () => {
        TOUCH_BAR_PROCESS.show();
    });

    app.on('will-quit', () => {
        globalShortcut.unregister('Cmd+Shift+Y');
        globalShortcut.unregisterAll();
    });
}
