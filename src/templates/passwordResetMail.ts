const passwordResetMail = (username: string, link: string) => (`
  <p>Hey ${username},</p>
  <br>
  <p>Forgot your password?</p>
  <br>
  <p>Please click on the link below to reset your password:</p>
  <a href="${link}"><strong>Reset Password</strong></a>
  <p>Please note that this link will expire in <em>30 minutes.</em></p>
  <br>
  <p>Thank you,<p>
  <p>Discord Clone</p>
`);

export default passwordResetMail;