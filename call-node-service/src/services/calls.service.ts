import { sendToQueue } from '../config/rabbitmq'
import { CallRecord } from '../types/api'
import { v4 as uuid } from 'uuid'
import {
    createCallRecord,
    getCallRecordById,
    updateCallStatus,
    updateCallUrl,
} from '../models/calls.model'
import { QUEUE_NAMES } from '../config/env'
import { logger } from '../utils/logger'

const CALLS_UPLOAD_QUEUE = QUEUE_NAMES.CALLS_UPLOAD_QUEUE

export const processCallAudio = async (
    filepath: string,
): Promise<CallRecord> => {
    if (!filepath) {
        throw new Error('File path is required to process call audio')
    }

    const call: CallRecord = {
        id: uuid(),
        audioUrl: filepath,
        status: 'processing',
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    try {
        await createCallRecord(call)
        logger.info(`Call record created in DB`, { callId: call.id })

        await sendToQueue(CALLS_UPLOAD_QUEUE, call)
        logger.info(`Call pushed to RabbitMQ queue`, { callId: call.id })
    } catch (err: any) {
        logger.error(`Error while processing call: ${err.message}`)
        if (call.id) await updateCallStatus(call.id, 'failed')
        throw err
    }

    return call
}

export const getCallById = async (id: string): Promise<CallRecord | null> => {
    if (!id) throw new Error('Call ID required')

    const call = await getCallRecordById(id)

    logger.info(`Fetched call record for ID: ${id}`)

    return call
}

export const updateCallStatusById = async (
    id: string,
    status: string,
): Promise<void> => {
    if (!id) throw new Error('Call ID required')

    await updateCallStatus(id, status)
    logger.info(`Call status updated for ID, ${id} to status: ${status}`)
}

export const updateCallUrlById = async (
    id: string,
    url: string,
): Promise<void> => {
    if (!id) throw new Error('Call ID required')
    if (!url) throw new Error('URL required')

    await updateCallUrl(id, url)
    logger.info(`Call URL updated for ID, ${id}`)
}
