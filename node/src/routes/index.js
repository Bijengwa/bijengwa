const { Router } = require('express');

const authRoutes = require('../auth/authRoutes');
const profileRoutes = require('./profileRoutes');
const propertyRoutes = require('./propertyRoutes');
const unitRoutes = require('./unitRoutes');
const searchRoutes = require('./searchRoutes');
const rentalAgreementRoutes = require('./rentalAgreementRoutes');
const paymentRoutes = require('./paymentRoutes');
const chatRoutes = require('./chatRoutes');
const settingsRoutes = require('./settingsRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/properties', propertyRoutes);
router.use('/units', unitRoutes);
router.use('/search', searchRoutes);
router.use('/rental-agreements', rentalAgreementRoutes);
router.use('/payments', paymentRoutes);
router.use('/chats', chatRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
