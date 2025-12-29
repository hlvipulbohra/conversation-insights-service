import fs from 'fs'
import cloudinary from '../config/cloudinary'
import { logger } from './logger'

interface UploadResult {
    public_id: string
    version: number
    secure_url: string
    [key: string]: any
}

export const uploadViaStream = async (
    localPath: string,
): Promise<UploadResult> => {
    logger.info(`Uploading file from path: ${localPath}`)

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'video',
                type: 'private',
                folder: 'call-audio',
            },
            (err, result) => {
                if (err) {
                    logger.error('Error uploading to Cloudinary', err)
                    return reject(err)
                }
                logger.info('File uploaded successfully', result)
                resolve(result as UploadResult)
            },
        )

        const readStream = fs.createReadStream(localPath)
        readStream.on('error', (err) => {
            logger.error('Error reading local file', err)
            reject(err)
        })

        readStream.pipe(uploadStream)
    })
}

export const generateSignedUrl = (publicId: string): string => {
    const signedUrl = cloudinary.url(publicId, {
        resource_type: 'video',
        type: 'private',
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    })
    return signedUrl
}
