import { Queue, Worker } from "bullmq";
import { sendEmail } from "../services/emailService.js";


const emailQueue = new Queue("emailQueue", {
  connection: {
    host: "127.0.0.1", // Ensure Redis is running correctly
    port: 6379,
  },
});

// ✅ Add email to queue (with retry)
export const sendEmailQueue = async (email, subject, body) => {
  try {
    const job = await emailQueue.add("sendEmail", { email, subject, body }, {
      attempts: 3, // Retry 3 times if it fails
      backoff: {
        type: "exponential", // Increase delay between retries
        delay: 5000, // Start retrying after 5 seconds
      },
    });

    console.log("📩 Email job added to queue:", job.id);
  } catch (error) {
    console.error("❌ Failed to add email to queue:", error);
  }
};

// ✅ Create a worker to process the queue
const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log(`📨 Processing job ID: ${job.id}`);
    const { email, subject, body } = job.data;

    try {
      await sendEmail(email, subject, body);
      console.log(`✅ Email sent to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${email}:`, error.message);
      throw error; // Trigger retry
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

// ✅ Handle worker events for debugging
emailWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

export default emailQueue;
