const { Router } = require('express');
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.post('/', chatController.createOrGetChat);
router.get('/', chatController.listChats);
router.get('/:uuid', chatController.getChat);
router.post('/:uuid/messages', chatController.sendMessage);
router.get('/:uuid/messages', chatController.getMessages);

module.exports = router;
