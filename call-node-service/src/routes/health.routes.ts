import { Router, Request, Response } from 'express'

const router = Router()

router.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        service: 'call-analytics-api',
        timestamp: new Date().toISOString(),
        message: 'Service is up and running',
    })
})

export default router
