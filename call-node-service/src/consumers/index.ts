import { connectRabbitMQ } from '../config/rabbitmq'
import { setupDlqConsumer } from '../consumers/dlq.consumer'
import { setupCallResultConsumer } from '../consumers/calls.results.consumer'
import { setupUploadConsumer } from '../consumers/calls.upload.consumer'

const setUpConsumers = async () => {
    await setupDlqConsumer()
    await setupCallResultConsumer()
    await setupUploadConsumer()
}

export const setupMq = async () => {
    await connectRabbitMQ(setUpConsumers)
}
