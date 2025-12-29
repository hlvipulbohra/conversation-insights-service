import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const start = Date.now()

    res.on('finish', () => {
        const obj = JSON.stringify({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: Date.now() - start,
        })

        logger.info('Request completed', obj)
    })

    res.on('error', (err) => {
        const obj = JSON.stringify({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: Date.now() - start,
            error: err.message,
            stack: err.stack,
        })
        logger.error('Response error', obj)
    })

    next()
}
