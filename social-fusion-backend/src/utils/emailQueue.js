import { Queue } from "bullmq";
const emailQueue = new Queue("emailQueue");

export const sendEmailQueue = (email, subject, body) => {
  emailQueue.add("sendEmail", { email, subject, body });
};
