import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { initDB } from './config/db'
import { setupMq } from './consumers/index'
import { PORT } from './config/env'
import { logger } from './utils/logger'

const startServer = async () => {
    try {
        await initDB()
        logger.info('DB initialized')

        await setupMq()
        logger.info('RabbitMQ initialized')

        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`)
        })
    } catch (err) {
        logger.error(JSON.stringify(err), 'Startup failed')
        process.exit(1)
    }
}

startServer()
