jest.mock('../src/models/profileModel');

const profileModel = require('../src/models/profileModel');
const { hashPassword } = require('../src/utils/password');
const authService = require('../src/auth/authService');
const ApiError = require('../src/utils/ApiError');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('returns a generic error for unknown emails', async () => {
      profileModel.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'missing@example.com',
          password: 'Password1',
        }),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: 'Invalid email or password',
      });
    });

    it('returns a generic error for a wrong password', async () => {
      profileModel.findByEmail.mockResolvedValue({
        uuid: 'user-1',
        email: 'owner@example.com',
        password: await hashPassword('CorrectPassword1'),
        is_verified: true,
      });

      await expect(
        authService.login({
          email: 'owner@example.com',
          password: 'WrongPassword1',
        }),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: 'Invalid email or password',
      });
    });

    it('requires verification instead of issuing a token', async () => {
      profileModel.findByEmail.mockResolvedValue({
        uuid: 'user-1',
        email: 'owner@example.com',
        password: await hashPassword('CorrectPassword1'),
        is_verified: false,
        verification_code: '123456',
      });

      const result = await authService.login({
        email: 'owner@example.com',
        password: 'CorrectPassword1',
      });

      expect(result).toEqual({
        verification_required: true,
        email: 'owner@example.com',
      });
    });

    it('returns a token and a public profile when verified', async () => {
      profileModel.findByEmail.mockResolvedValue({
        uuid: 'user-1',
        email: 'owner@example.com',
        password: await hashPassword('CorrectPassword1'),
        is_verified: true,
        verification_code: '123456',
        verification_code_expires_at: new Date(),
        verification_failed_attempts: 0,
      });

      const result = await authService.login({
        email: 'owner@example.com',
        password: 'CorrectPassword1',
      });

      expect(result.verification_required).toBe(false);
      expect(result.token).toEqual(expect.any(String));
      expect(result.profile.email).toBe('owner@example.com');
      expect(result.profile.password).toBeUndefined();
      expect(result.profile.verification_code).toBeUndefined();
      expect(result.profile.verification_failed_attempts).toBeUndefined();
    });
  });

  describe('verifyEmail', () => {
    it('does not reveal whether an email exists', async () => {
      profileModel.findByEmail.mockResolvedValue(null);

      await expect(
        authService.verifyEmail({
          email: 'missing@example.com',
          code: '123456',
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: 'Invalid or expired verification code',
      });
    });

    it('invalidates the code after too many failed attempts', async () => {
      const profile = {
        uuid: 'user-1',
        email: 'owner@example.com',
        is_verified: false,
        verification_code: '123456',
        verification_code_expires_at: new Date(Date.now() + 60_000),
        verification_failed_attempts: 4,
      };

      profileModel.findByEmail.mockResolvedValue(profile);
      profileModel.update.mockResolvedValue(profile);

      await expect(
        authService.verifyEmail({
          email: 'owner@example.com',
          code: '000000',
        }),
      ).rejects.toBeInstanceOf(ApiError);

      expect(profileModel.update).toHaveBeenCalledWith('user-1', {
        verification_code: null,
        verification_code_expires_at: null,
        verification_failed_attempts: 0,
      });
    });
  });
});
