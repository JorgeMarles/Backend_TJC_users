import ampq from 'amqplib';
import { RABBITMQ_HOST, RABBITMQ_PASSWORD, RABBITMQ_PORT, RABBITMQ_USERNAME } from '../config';

type QueueInfo = {
    type: string,
    exchange: string,
    arguments: {
        [key: string]: any
    }
}

type QueueOutData = {
    info?: QueueInfo,
    queue: ampq.Replies.AssertQueue | null,
}

type QueueInData = {
    info?: QueueInfo,
    queue: ampq.Replies.AssertQueue | null,
    consume: (channel: ampq.Channel, msg: ampq.ConsumeMessage | null) => Promise<any>
}
type RabbitMQUtils = {
    queuesOut: {
        [key: string]: QueueOutData
    },
    queuesIn?: {
        [key: string]: QueueInData
    }
    channel: ampq.Channel | null
}

const rmq: RabbitMQUtils = {
    queuesOut: {
        'user-stats': {
            queue: null
        },
        'user-creation': {
            info: {
                type: 'fanout',           // Cambiar a fanout
                exchange: 'user-broadcast',
                arguments: {}
            },
            queue: null
        }
    },
    channel: null
}

export const connectRabbitMQ = async () => {
    try {
        console.log('Connecting to RabbitMQ at', getRabbitMQURL(), '...');

        const connection = await ampq.connect(getRabbitMQURL());
        const channel = await connection.createChannel();


        for (const key in rmq.queuesOut) {
            const queue = key;
            
            if (rmq.queuesOut[key].info) {
                const { type, exchange } = rmq.queuesOut[key].info;
                await channel.assertExchange(exchange, type, { 
                    durable: true, 
                    arguments: rmq.queuesOut[key].info.arguments 
                });
            
            } else {
                rmq.queuesOut[key].queue = await channel.assertQueue(queue, { durable: true });
            }
            
            console.log(`Queue ${queue} is ready`);
        }

        rmq.channel = channel;
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

type UserData = {
    userId: number;
}

type UserMessage = {
    type: "user";
    data: UserData
}

type Message = UserMessage | UserData;

export const sendUserMessage = async (userId: number) => {
    const message: Message = {
        type: "user",
        data: {
            userId,
        }
    }
    await publishMessage('user-stats', JSON.stringify(message));
    console.log(`Sent message for user ${userId}`);
}

export const sendUserCreationMessage = async (userId: number) => {
    const message: Message = {
        userId
    }

    await publishToExchange('user-broadcast', '', JSON.stringify(message));
    console.log(`Broadcast message for create user with id ${userId}`);
}

const publishToExchange = async (exchange: string, routingKey: string, message: string, options?: ampq.Options.Publish) => {
    try {
        if (!rmq.channel) {
            throw new Error('Channel is not initialized');
        }
        
        rmq.channel.publish(exchange, routingKey, Buffer.from(message), { 
            ...options, 
            persistent: true 
        });
    } catch (error) {
        console.error(`Error publishing message to exchange ${exchange}:`, error);
        throw error;
    }
}

const publishMessage = async (queue: string, message: string, options?: ampq.Options.Publish) => {
    try {
        const queueObj: ampq.Replies.AssertQueue | null = rmq.queuesOut[queue].queue;
        if (!queueObj || !rmq.channel) {
            throw new Error(`Either the Channel or the Queue ${queue} is not initialized or does not exist.`);
        }
        rmq.channel.sendToQueue(queueObj.queue, Buffer.from(message), { ...options, persistent: true });
    } catch (error) {
        console.error(`Error publishing message in queue ${queue} to RabbitMQ:`, error);
        throw error;
    }
}

const getRabbitMQURL = () => {
    return `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;
}