const passwordResetMail = (username: string, link: string) => (`
  <p>Hey ${username},</p>
  <br>
  <p>Forgot your password?</p>
  <br>
  <p>Please click on the link below to reset your password:</p>
  <a href="${link}">${link}</a>
  <p>Please note that the link will expire in <strong>30 minutes.</strong></p>
  <br>
  <p>Thank you,<p>
  <p>Discord Clone</p>
`);

export default passwordResetMail;