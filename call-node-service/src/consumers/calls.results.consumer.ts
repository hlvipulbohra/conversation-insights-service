import { createChannel, sendToQueue } from '../config/rabbitmq'
import { processCallAudio } from '../services/calls.analysis.service'
import { QUEUE_NAMES } from '../config/env'
import { CallProcessingResult } from '../types/api'
import { ConsumeMessage, Channel } from 'amqplib'
import { logger } from '../utils/logger'

const DEAD_LETTER_QUEUE = QUEUE_NAMES.DEAD_LETTER_QUEUE
const CALLS_RESULTS_QUEUE = QUEUE_NAMES.CALLS_RESULTS_QUEUE

async function processCallAnalysis(
    callsResult: CallProcessingResult,
    channel: Channel,
    msg: ConsumeMessage,
) {
    try {
        if (!callsResult?.callId) throw new Error('callId is required')

        logger.info('Processing calls_result:', callsResult.callId)
        await processCallAudio(callsResult)
        channel.ack(msg)
    } catch (error: any) {
        logger.error('Error processing calls_result:', error?.message)
        await sendToQueue(DEAD_LETTER_QUEUE, callsResult)
        channel.nack(msg, false, false) // Dont add back to queue as we are sending it to DLQ
    }
}

export async function setupCallResultConsumer() {
    try {
        const channel = await createChannel(true, setupCallResultConsumer)
        await channel.assertQueue(CALLS_RESULTS_QUEUE, { durable: true })

        channel.consume(
            CALLS_RESULTS_QUEUE,
            async (msg: ConsumeMessage | null) => {
                if (!msg) return

                let parsed: CallProcessingResult

                try {
                    parsed = JSON.parse(msg.content.toString())
                } catch {
                    logger.error('INVALID_MESSAGE_JSON', msg.content.toString())
                    channel.ack(msg)
                    return
                }

                await processCallAnalysis(parsed, channel, msg)
            },
        )

        logger.info(`Consumer listening on queue: ${CALLS_RESULTS_QUEUE}`)
    } catch (err: any) {
        logger.error('Error setting up consumer:', err.message)
    }
}
