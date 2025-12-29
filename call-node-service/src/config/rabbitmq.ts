import amqplib, { ChannelModel, Channel } from 'amqplib'
import { RABBITMQ_URL } from './env'
import { logger } from '../utils/logger'

let connection: ChannelModel | null = null
let defaultChannel: Channel | null = null

export const connectRabbitMQ = async (onConnect?: () => Promise<void>) => {
    if (connection) return connection

    try {
        connection = await amqplib.connect(RABBITMQ_URL)
        logger.info('RabbitMQ connected')

        connection.on('error', (err) => {
            logger.error('RabbitMQ connection error', err)
            connection = null
            defaultChannel = null
        })

        connection.on('close', async () => {
            logger.warn('RabbitMQ connection closed. Reconnecting in 5s...')
            connection = null
            defaultChannel = null
            setTimeout(() => connectRabbitMQ(onConnect).catch(() => {}), 5000)
        })

        if (onConnect) await onConnect()
        return connection
    } catch (err) {
        logger.error('RabbitMQ connection failed', err)
        setTimeout(() => connectRabbitMQ(onConnect).catch(() => {}), 5000)
        throw err
    }
}

export const createChannel = async (
    newChannel = false,
    onConnect?: () => Promise<void>,
): Promise<Channel> => {
    if (!newChannel && defaultChannel) return defaultChannel

    if (!connection) await connectRabbitMQ(onConnect)
    const channel = await connection!.createChannel()

    if (!newChannel) defaultChannel = channel
    return channel
}

export const sendToQueue = async (queueName: string, message: unknown) => {
    const channel = await createChannel(false)
    await channel.assertQueue(queueName, { durable: true })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    })

    logger.info(`Message sent to queue ${queueName}`)
}
