import { sendEmail } from "@/lib/email/send";

export type InvestorRequestPayload = {
  name: string;
  email: string;
  message?: string;
};

export { sendEmail };
