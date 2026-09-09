const asyncHandler = require('../utils/asyncHandler');
const unitModel = require('../models/unitModel');

const searchAvailableUnits = asyncHandler(async (req, res) => {
  const { location, purpose, room_type: roomType, min_price: minPrice, max_price: maxPrice, page, limit } = req.query;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const results = await unitModel.searchAvailable({
    location,
    purpose,
    roomType,
    minPrice,
    maxPrice,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });

  res.json({ success: true, data: results, meta: { page: pageNum, limit: limitNum } });
});

module.exports = { searchAvailableUnits };
