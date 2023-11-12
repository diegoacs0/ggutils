
import fs from 'fs';
const config = {
    loggerFolder: './node_modules/@gluon-framework/gluon/src/lib'
}



function gluonSetup() {
    loggerDisable();
}

function loggerDisable() {
    let string = `let loggerStatus = false;
    const rgb = (r, g, b, msg) => "";
    
    export const log = (...args) => "";
    export const logInline = (...args) =>  "";
    
    export const dangerousAPI = (func, option, value) => "";`

    fs.writeFileSync(config.loggerFolder + '/logger.js', string);
}

gluonSetup();
