import { Queue } from "bullmq";

const emailQueue = new Queue("emailQueue", {
  connection: {
    host: "127.0.0.1", // Ensure this is correct
    port: 6379,        // Ensure Redis is running on this port
  },
});

export const sendEmailQueue = async (email, subject, body) => {
  const job = await emailQueue.add("sendEmail", { email, subject, body });
  console.log("📩 Email job added to queue:", job.id); // Debugging
};
