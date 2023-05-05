import { createTransport } from 'nodemailer';

import env from './env.config';

const mailTransporter = createTransport({
  service: env.SMTP_SERVICE,
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  }
});

export default mailTransporter;