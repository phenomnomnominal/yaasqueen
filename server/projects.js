const { TouchBar } = require('electron');
const Store = require('electron-store');
const { read } = require('./config');

const store = new Store();

module.exports = {
    addProject,
    checkProjects,
    removeProject,
    setCurrentProject
};

function addProject (path) {
    let projects = store.get('projects');

    let names = projects.map(project => project.info.name);
    let info = read(path);
    let { name } = info;

    if (!name || names.indexOf(name) >= 0) {
        return;
    } else {
        projects.push({ path, info });
        store.set('projects', projects);
    }
}

function checkProjects () {
    let projects = store.get('projects') || [];

    let validProjects = [];
    projects.forEach(project => {
        let info = read(project.path);
        if (!info || !info.name || info.name !== project.info.name) {
            return;
        }
        validProjects.push(project);
    });
    store.set('projects', validProjects);

    let current = store.get('current');
    let validCurrent = validProjects.find(project => project.info.name === current);
    return validCurrent ? validCurrent : validProjects;
}

function removeProject (path) {
    let projects = store.get('projects');

    let projectIndex = projects.findIndex(project => project.path === path);
    projects.splice(projectIndex, 1);
    store.set('projects', projects);
}

function setCurrentProject (name) {
    store.set('current', name);
}
