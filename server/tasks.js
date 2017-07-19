const { exec } = require('child_process');

module.exports = {
    run
};

function run (script, cwd, callback) {
    exec(script, { cwd }, (error) => {
        if (error) {
            callback();
        } else {
            callback();
        }
    });
}
