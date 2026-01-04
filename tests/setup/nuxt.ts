const helper = {
  preference: 'light',
  value: 'light',
  getColorScheme: () => 'light',
  addColorScheme: () => {},
  removeColorScheme: () => {},
}

const globalName = '__NUXT_COLOR_MODE__'

const globalTarget = globalThis as typeof globalThis & { [key: string]: unknown }
if (!globalTarget[globalName]) {
  globalTarget[globalName] = helper
}

if (typeof window !== 'undefined') {
  const windowTarget = window as typeof window & { [key: string]: unknown }
  if (!windowTarget[globalName]) {
    windowTarget[globalName] = helper
  }
}
