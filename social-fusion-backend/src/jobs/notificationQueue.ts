import { Queue } from "bullmq";
import createRedisClient from "../utils/redis";

const redisClient = createRedisClient();// Connect to Redis
const notificationQueue = new Queue("notifications", { connection: redisClient });

export default notificationQueue;
