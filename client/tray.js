const { Tray } = require('electron');
const path = require('path');

let TRAY_PROCESS;

module.exports = {
    createTrayProcess
};

function createTrayProcess (toggleSettings) {
    let imageFolder = path.join(process.cwd() , '/assets/images');
    let trayImage = path.join(imageFolder, '/osx/iconTemplate.png');

    let TRAY_PROCESS = new Tray(trayImage);
    TRAY_PROCESS.setToolTip('yaasqueen!');

    TRAY_PROCESS.on('click', () => {
        toggleSettings();
    });

    return TRAY_PROCESS;
}
