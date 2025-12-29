import { createChannel } from '../config/rabbitmq'
import { updateCallStatusById } from '../services/calls.service'
import { QUEUE_NAMES } from '../config/env'
import { ConsumeMessage } from 'amqplib'
import { logger } from '../utils/logger'

const DEAD_LETTER_QUEUE = QUEUE_NAMES.DEAD_LETTER_QUEUE

async function processDeadLetter(msg: ConsumeMessage, channel: any) {
    try {
        const callData = JSON.parse(msg.content.toString())

        if (!callData?.id) throw new Error('Missing call id')

        await updateCallStatusById(callData.id, 'failed')

        logger.error(`Processed DLQ message for call ID: ${callData.id}`)
        channel.ack(msg)
    } catch (error: any) {
        logger.error(`Error processing DLQ message: ${error.message}`)

        channel.nack(msg, false, false) // Don't requeue the message
    }
}

export async function setupDlqConsumer() {
    try {
        const channel = await createChannel(true, setupDlqConsumer)
        await channel.assertQueue(DEAD_LETTER_QUEUE, { durable: true })

        channel.consume(
            DEAD_LETTER_QUEUE,
            async (msg: ConsumeMessage | null) => {
                if (!msg) return
                await processDeadLetter(msg, channel)
            },
        )

        logger.info(`Consumer listening on queue: ${DEAD_LETTER_QUEUE}`)
    } catch (err: any) {
        logger.error(`Error setting up consumer: ${err.message}`)
    }
}
