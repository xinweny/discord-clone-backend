const passwordResetMail = (username: string, link: string) => (`
  <p>Hey ${username},</p>
  <br>
  <p>Welcome to Discord Clone!</p>
  <br>
  <p>Please click on the link below to verify your email address:</p>
  <a href="${link}"><strong>Verify Email</strong></a>
  <p>Please note that this link will expire in <em>30 minutes.</em></p>
  <br>
  <p>Thank you,<p>
  <p>Discord Clone</p>
`);

export default passwordResetMail;