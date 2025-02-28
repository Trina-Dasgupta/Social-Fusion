import { Queue } from "bullmq";
import { Redis } from "ioredis";

const redis = new Redis();
const notificationQueue = new Queue("notifications", { connection: redis });

export default notificationQueue;
