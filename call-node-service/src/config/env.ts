function getEnv(name: string): string {
    const value = process.env[name]
    if (!value) throw new Error(`Missing env var: ${name}`)
    return value
}

export const PORT = Number(process.env.PORT || 3000)

export const DB_CONFIG = {
    DB_HOST: getEnv('DB_HOST'),
    DB_PORT: Number(process.env.DB_PORT || 5432),
    DB_USER: getEnv('DB_USER'),
    DB_PASSWORD: getEnv('DB_PASSWORD'),
    DB_NAME: getEnv('DB_NAME'),
}

export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost'

export const QUEUE_NAMES = {
    CALLS_RESULTS_QUEUE:
        process.env.CALLS_RESULTS_QUEUE || 'calls_results_queue',
    DEAD_LETTER_QUEUE: process.env.DEAD_LETTER_QUEUE || 'dead_letter_queue',
    CALLS_PROCESSING_QUEUE:
        process.env.CALLS_PROCESSING_QUEUE || 'calls_processing_queue',
    CALLS_UPLOAD_QUEUE: process.env.CALLS_UPLOAD_QUEUE || 'calls_upload_queue',
}

export const CLOUDINARY_CONFIG = {
    CLOUD_NAME: getEnv('CLOUD_NAME'),
    API_KEY: getEnv('API_KEY'),
    API_SECRET: getEnv('API_SECRET'),
}

export const ALLOWED_ORIGINS: string[] = [
    'http://localhost:5173',
    process.env.FRONTEND_URL || '',
].filter(Boolean)
