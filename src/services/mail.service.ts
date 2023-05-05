import mailTransporter from '../config/mailer.config';

import env from '../config/env.config';

const sendMail = async (to: string, subject: string, htmlTemplate: string) => {
  const mailOptions = {
    from: env.SMTP_EMAIL,
    to,
    subject,
    html: htmlTemplate,
  };

  await mailTransporter.sendMail(mailOptions);

  return mailOptions;
}

export default {
  sendMail,
}