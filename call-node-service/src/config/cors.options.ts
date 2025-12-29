import cors from 'cors'
import { ALLOWED_ORIGINS } from './env'

const allowedOrigins = ALLOWED_ORIGINS

export const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)

        callback(new Error('Not allowed by CORS'))
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
    optionsSuccessStatus: 200,
}
