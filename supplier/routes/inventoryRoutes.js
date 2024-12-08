const express = require('express');
const { addInventoryLog, getInventoryLogs, getInventoryLogById, updateInventoryLog, deleteInventoryLog } = require('../controllers/inventoryController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', addInventoryLog); // Add a new inventory log
router.get('/', getInventoryLogs); // Get all inventory logs
router.get('/:id', getInventoryLogById); // Get a specific inventory log by ID
router.put('/:id', updateInventoryLog); // Update an inventory log
router.delete('/:id', deleteInventoryLog); // Delete an inventory log

module.exports = router;