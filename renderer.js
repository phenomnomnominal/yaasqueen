const Store = require('electron-store');
const store = new Store();
const fs = require('fs');
const path = require('path');
const { remote } = require('electron');

var projects = remote.require('./server/projects.js');
var touchBar = remote.require('./client/touchbar.js');

document.ondragover = document.ondrop = (event) => {
    event.preventDefault();
};

document.body.ondrop = (event) => {
    event.preventDefault();

    let [file] = event.dataTransfer.files;
    let project = file.path;
    try {
        let rc = fs.readFileSync(path.join(project, '.yasrc'), 'utf8');
        projects.addProject(project);
        touchBar.renderTouchBar();
        document.body.innerHTML = rc;
    } catch (e) {

    }
};
