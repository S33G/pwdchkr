const error: Function = (message: string): void => {
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

export const logger = {
  error,
  info,
  warn,
  success,
}
