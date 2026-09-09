const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const profileModel = require('../models/profileModel');

const getMe = asyncHandler(async (req, res) => {
  const profile = await profileModel.findPublicById(req.user.uuid);
  if (!profile) throw ApiError.notFound('Profile not found');
  res.json({ success: true, data: profile });
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileModel.findPublicById(req.params.uuid);
  if (!profile) throw ApiError.notFound('Profile not found');
  res.json({ success: true, data: profile });
});

const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['full_name', 'username', 'phone_number', 'profile_pic'];
  const data = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  });

  if (data.username) {
    const existing = await profileModel.findByUsername(data.username);
    if (existing && existing.uuid !== req.user.uuid) {
      throw ApiError.conflict('Username already taken');
    }
  }

  const profile = await profileModel.update(req.user.uuid, data);
  const { password: _pw, ...safeProfile } = profile;
  res.json({ success: true, data: safeProfile });
});

module.exports = { getMe, getProfile, updateMe };
