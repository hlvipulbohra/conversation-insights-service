import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import healthRoutes from './routes/health.routes'
import callsRoutes from './routes/calls.routes'
import { corsOptions } from './config/cors.options'
import { requestLogger } from './middlewares/request.logger'

const app = express()
// health routes before cors setup
app.use('/', healthRoutes)

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }))
app.use(requestLogger)

// routes
app.use('/api/calls', callsRoutes)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

export default app
