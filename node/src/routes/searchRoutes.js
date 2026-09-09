const { Router } = require('express');
const searchController = require('../controllers/searchController');

const router = Router();

router.get('/units', searchController.searchAvailableUnits);

module.exports = router;
