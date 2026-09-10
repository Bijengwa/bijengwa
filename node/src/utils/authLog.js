function authLog(message) {
  console.log(`[AUTH] ${message}`);
}

function logVerificationCodeIssued(code, nodeEnv = process.env.NODE_ENV) {
  if (nodeEnv === 'production') {
    authLog('Verification code generated');
    return;
  }

  /*
   * Temporary local-development delivery until an email provider is wired.
   * Do not include the recipient email, password, or token in this log.
   */
  console.log('[DEV] Verification code issued');
  console.log(`[DEV] Verification code: ${code}`);
}

module.exports = {
  authLog,
  logVerificationCodeIssued,
};
