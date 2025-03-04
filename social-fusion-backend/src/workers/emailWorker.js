import { Worker } from "bullmq";
import sendEmail from "../utils/sendEmail"; // Your email sending function

const emailWorker = new Worker("emailQueue", async (job) => {
  console.log(`📧 Processing email job: ${job.id}`, job.data);
  const { email, subject, body } = job.data;

  try {
    await sendEmail(email, subject, body);
    console.log("✅ Email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}, {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});

emailWorker.on("completed", (job) => {
  console.log(`🎉 Job completed: ${job.id}`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job.id}`, err);
});
