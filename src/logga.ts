import figlet = require("figlet");
const HAS_SILLY_ASCII_TITLE = true;

const error: Function = (message: string): void => {
    if (HAS_SILLY_ASCII_TITLE) console.log(figlet.textSync('Whoopsie.', { horizontalLayout: 'full' }));
    console.error('❌ ' + message);
}

const info: Function = (message: string): void => {
    console.info('ℹ ' + message);
}

const warn: Function = (message: string): void => {
    console.warn('⚠️ ' + message);
}

const success: Function = (message: string): void => {
    console.log('✅ ' + message);
}

export const logga = {
    error,
    info,
    warn,
    success,
}
