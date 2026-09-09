const asyncHandler = require('../utils/asyncHandler');
const { assertOneOf } = require('../utils/validate');
const settingsModel = require('../models/settingsModel');

const getSettings = asyncHandler(async (req, res) => {
  let settings = await settingsModel.findByUser(req.user.uuid);
  if (!settings) {
    settings = await settingsModel.create({ user_uuid: req.user.uuid });
  }
  res.json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const { language, theme } = req.body;
  assertOneOf(language, ['en', 'sw'], 'language');
  assertOneOf(theme, ['light', 'dark'], 'theme');

  const data = {};
  if (language !== undefined) data.language = language;
  if (theme !== undefined) data.theme = theme;

  const settings = await settingsModel.upsert(req.user.uuid, data);
  res.json({ success: true, data: settings });
});

module.exports = { getSettings, updateSettings };
