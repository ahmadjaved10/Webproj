const express = require('express');
const { addInventoryLog, getInventoryLogs } = require('../controllers/inventoryController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', addInventoryLog);
router.get('/', getInventoryLogs);

module.exports = router;
