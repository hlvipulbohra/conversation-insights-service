import { createChannel, sendToQueue } from '../config/rabbitmq'
import { QUEUE_NAMES } from '../config/env'
import { ConsumeMessage } from 'amqplib'
import { CallRecord } from '../types/api'
import { generateSignedUrl, uploadViaStream } from '../utils/cloudinary'
import { updateCallUrl } from '../models/calls.model'
import { logger } from '../utils/logger'
import fs from 'fs/promises'

const DEAD_LETTER_QUEUE = QUEUE_NAMES.DEAD_LETTER_QUEUE
const CALLS_UPLOAD_QUEUE = QUEUE_NAMES.CALLS_UPLOAD_QUEUE
const CALLS_PROCESSING_QUEUE = QUEUE_NAMES.CALLS_PROCESSING_QUEUE

const deleteFile = async (filePath: string) => {
    try {
        // Check if file exists first
        const exists = await fs
            .stat(filePath)
            .then(() => true)
            .catch(() => false)
        if (!exists) {
            logger.warn('File does not exist, skipping delete:', filePath)
            return
        }

        await fs.unlink(filePath)
        logger.info('Deleted local file:', filePath)
    } catch (err: any) {
        logger.error(`Failed to delete local file ${filePath}`, err?.message)
    }
}

const processCallUpload = async (
    call: CallRecord,
    msg: ConsumeMessage,
    channel: any,
) => {
    try {
        if (!call?.id) throw new Error('call.id missing')
        if (!call?.audioUrl) throw new Error('audioUrl missing')

        logger.info(`Starting upload for call ID: ${call.id}`)

        const result: any = await uploadViaStream(call.audioUrl)
        const publicId = result.public_id

        await updateCallUrl(call.id, publicId)

        const signedUrl = generateSignedUrl(publicId)
        const filePath = call.audioUrl
        call.audioUrl = signedUrl

        await sendToQueue(CALLS_PROCESSING_QUEUE, call)

        logger.info(`Successfully processed upload for call ID: ${call.id}`)

        // Delete local file safely
        await deleteFile(filePath)

        channel.ack(msg)
    } catch (error: any) {
        logger.error(`Error processing call upload for call ID: ${call.id}`)
        await sendToQueue(DEAD_LETTER_QUEUE, call)
        channel.nack(msg, false, false)
    }
}

export async function setupUploadConsumer() {
    try {
        const channel = await createChannel(true, setupUploadConsumer)
        await channel.assertQueue(CALLS_UPLOAD_QUEUE, { durable: true })

        channel.consume(
            CALLS_UPLOAD_QUEUE,
            async (msg: ConsumeMessage | null) => {
                if (!msg) return

                let call: CallRecord

                try {
                    call = JSON.parse(msg.content.toString())
                } catch {
                    logger.error(
                        `Invalid message format: ${msg.content.toString()}`,
                    )
                    channel.ack(msg)
                    return
                }

                await processCallUpload(call, msg, channel)
            },
        )

        logger.info(`Consumer listening on queue: ${CALLS_UPLOAD_QUEUE}`)
    } catch (err: any) {
        logger.error(`Error setting up consumer: ${err.message}`)
    }
}
