import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_CONFIG } from './env'
import { logger } from '../utils/logger'

if (
    !CLOUDINARY_CONFIG.CLOUD_NAME ||
    !CLOUDINARY_CONFIG.API_KEY ||
    !CLOUDINARY_CONFIG.API_SECRET
) {
    logger.error('Missing Cloudinary environment variables')
    throw new Error('Cloudinary config missing')
}

cloudinary.config({
    cloud_name: CLOUDINARY_CONFIG.CLOUD_NAME,
    api_key: CLOUDINARY_CONFIG.API_KEY,
    api_secret: CLOUDINARY_CONFIG.API_SECRET,
    secure: true,
})

logger.info('Cloudinary initialized')

export default cloudinary
