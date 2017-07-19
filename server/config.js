const fs = require('fs');
const path = require('path');

exports.read = function read (dir) {
    let rc;
    try {
        rc = fs.readFileSync(path.join(dir, '.yasrc'), 'utf8');
    } catch (e) {
        return null;
    }

    let info;
    try {
        info = JSON.parse(rc);
    } catch (e) {
        return null;
    }
    return info;
}
