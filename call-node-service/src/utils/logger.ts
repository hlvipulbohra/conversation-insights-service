const formatMessage = (level: string, message: string, data?: unknown) => {
    const timestamp = new Date().toISOString()
    const details =
        data === undefined
            ? ''
            : typeof data === 'string'
              ? ` | ${data}`
              : ` | ${JSON.stringify(data)}`

    return `[${level.toUpperCase()}] [${timestamp}] ${message}${details}`
}

export const logger = {
    info: (message: string, data?: unknown) => {
        console.log(formatMessage('INFO', message, data))
    },

    warn: (message: string, data?: unknown) => {
        console.warn(formatMessage('WARN', message, data))
    },

    error: (message: string, data?: unknown) => {
        console.error(formatMessage('ERROR', message, data))
    },
}
