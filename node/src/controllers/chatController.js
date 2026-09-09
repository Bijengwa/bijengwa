const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { requireFields } = require('../utils/validate');
const chatModel = require('../models/chatModel');
const chatMessageModel = require('../models/chatMessageModel');
const unitModel = require('../models/unitModel');
const propertyModel = require('../models/propertyModel');

async function assertParticipant(chat, userUuid) {
  if (chat.tenant_uuid !== userUuid && chat.owner_uuid !== userUuid) {
    throw ApiError.forbidden('You are not part of this chat');
  }
}

const createOrGetChat = asyncHandler(async (req, res) => {
  requireFields(req.body, ['unit_uuid']);
  const { unit_uuid } = req.body;

  const unit = await unitModel.findById(unit_uuid);
  if (!unit) throw ApiError.notFound('Unit not found');
  const property = await propertyModel.findById(unit.property_uuid);
  if (!property) throw ApiError.notFound('Property not found');

  if (property.owner_uuid === req.user.uuid) {
    throw ApiError.badRequest('You cannot start a chat on your own unit');
  }

  let chat = await chatModel.findByUnitAndTenant(unit_uuid, req.user.uuid);
  if (!chat) {
    chat = await chatModel.create({
      unit_uuid,
      tenant_uuid: req.user.uuid,
      owner_uuid: property.owner_uuid,
      status: 'open',
    });
  }

  res.status(201).json({ success: true, data: chat });
});

const listChats = asyncHandler(async (req, res) => {
  const chats = await chatModel.findForUser(req.user.uuid);
  res.json({ success: true, data: chats });
});

const getChat = asyncHandler(async (req, res) => {
  const chat = await chatModel.findById(req.params.uuid);
  if (!chat) throw ApiError.notFound('Chat not found');
  await assertParticipant(chat, req.user.uuid);
  res.json({ success: true, data: chat });
});

const sendMessage = asyncHandler(async (req, res) => {
  requireFields(req.body, ['message']);
  const chat = await chatModel.findById(req.params.uuid);
  if (!chat) throw ApiError.notFound('Chat not found');
  await assertParticipant(chat, req.user.uuid);

  const message = await chatMessageModel.create({
    chat_uuid: chat.uuid,
    sender_uuid: req.user.uuid,
    message: req.body.message,
  });

  res.status(201).json({ success: true, data: message });
});

const getMessages = asyncHandler(async (req, res) => {
  const chat = await chatModel.findById(req.params.uuid);
  if (!chat) throw ApiError.notFound('Chat not found');
  await assertParticipant(chat, req.user.uuid);

  const messages = await chatMessageModel.findByChat(chat.uuid);
  res.json({ success: true, data: messages });
});

module.exports = { createOrGetChat, listChats, getChat, sendMessage, getMessages };
