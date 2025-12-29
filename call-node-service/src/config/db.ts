import { Pool } from 'pg'
import { DB_CONFIG } from './env'
import { logger } from '../utils/logger'

export const pool = new Pool({
    host: DB_CONFIG.DB_HOST,
    port: DB_CONFIG.DB_PORT,
    user: DB_CONFIG.DB_USER,
    password: DB_CONFIG.DB_PASSWORD,
    database: DB_CONFIG.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
})

export async function initDB(): Promise<void> {
    try {
        const client = await pool.connect()
        await client.query('SELECT 1')
        client.release()
        logger.info('Postgres connected')
    } catch (err) {
        logger.error('Failed to connect to Postgres', err)
        process.exit(1)
    }
}
