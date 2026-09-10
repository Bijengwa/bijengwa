const { logVerificationCodeIssued } = require('../src/utils/authLog');

describe('logVerificationCodeIssued', () => {
  let logs;

  beforeEach(() => {
    logs = [];
    jest.spyOn(console, 'log').mockImplementation((...args) => {
      logs.push(args.join(' '));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not print the verification code in production', () => {
    logVerificationCodeIssued('123456', 'production');

    const combined = logs.join('\n');

    expect(combined).toContain('[AUTH] Verification code generated');
    expect(combined).not.toContain('123456');
    expect(combined).not.toMatch(/@/);
  });

  it('prints the code without an email in development', () => {
    logVerificationCodeIssued('123456', 'development');

    const combined = logs.join('\n');

    expect(combined).toContain('[DEV] Verification code issued');
    expect(combined).toContain('123456');
    expect(combined).not.toMatch(/@/);
  });
});
