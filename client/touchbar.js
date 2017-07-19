const { BrowserWindow, TouchBar } = require('electron');
const { checkProjects, removeProject, setCurrentProject } = require('../server/projects');
const { run } = require('../server/tasks');
const { toggleSettings } = require('./settings');

let TOUCH_BAR_PROCESS;

module.exports = {
    createTouchBarProcess,
    renderTouchBar
};

function createTouchBarProcess () {
    TOUCH_BAR_PROCESS = new BrowserWindow({
        width: 0,
        height: 0
    });
    TOUCH_BAR_PROCESS.loadURL('about:blank');
    return TOUCH_BAR_PROCESS;
}

function renderTouchBar () {
    let projects = checkProjects();
    if (Array.isArray(projects)) {
        _renderProjects(TOUCH_BAR_PROCESS, projects);
    } else {
        _renderTasks(TOUCH_BAR_PROCESS, projects);
    }
    TOUCH_BAR_PROCESS.show();
}

function _renderProjects (TOUCH_BAR_PROCESS, projects) {
    let barItems = [];
    if (projects.length === 0) {
        barItems.push(new TouchBar.TouchBarLabel({
            label: 'You need to',
        }));
        barItems.push(new TouchBar.TouchBarButton({
            label: 'ADD 🌟',
            click: () => {
                toggleSettings(true);
            }
        }));
        barItems.push(new TouchBar.TouchBarLabel({
            label: 'some projects!',
        }));
    } else {
        projects.forEach(project => {
            let { path, info } = project;
            barItems.push(new TouchBar.TouchBarSpacer({ size: 'large' }));
            barItems.push(new TouchBar.TouchBarButton({
                label: info.name,
                click: () => {
                    setCurrentProject(info.name);
                    _renderTasks(TOUCH_BAR_PROCESS, project);
                }
            }));
        });
    }
    TOUCH_BAR_PROCESS.setTouchBar(new TouchBar(barItems));
}

const RUNNING = 'RUNNING 👟';
function _renderTasks (TOUCH_BAR_PROCESS, project) {
    let barItems = [
        new TouchBar.TouchBarSpacer({ size: 'large' }),
        new TouchBar.TouchBarButton({
            label: '⬅️',
            click: () => {
                setCurrentProject(null);
                renderTouchBar(TOUCH_BAR_PROCESS);
            }
        }),
        new TouchBar.TouchBarSpacer({ size: 'flexible' })
    ];

    project.info.tasks.forEach(task => {
        barItems.push(new TouchBar.TouchBarSpacer({ size: 'small' }));
        let taskButton = new TouchBar.TouchBarButton({
            label: task.name,
            backgroundColor: task.color,
            click: () => {
                taskButton.label = RUNNING;
                run(task.script, project.path, () => {
                    taskButton.label = task.name;
                });
            }
        });
        barItems.push(taskButton);
    });

    barItems.push(new TouchBar.TouchBarSpacer({ size: 'flexible' }));
    barItems.push(new TouchBar.TouchBarButton({
        label: '💀',
        click: () => {
            removeProject(project);
            setCurrentProject(null);
            renderTouchBar(TOUCH_BAR_PROCESS);
        }
    }));

    TOUCH_BAR_PROCESS.setTouchBar(new TouchBar({ items: barItems }));
}
