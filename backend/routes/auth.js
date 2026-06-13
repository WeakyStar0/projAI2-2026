const express = require('express');
const router = express.Router();
const { registerWarehouse, loginWarehouse, registerStore, loginStore } = require('../controllers/authController');

router.post('/warehouse/register', registerWarehouse);
router.post('/warehouse/login', loginWarehouse);
router.post('/store/register', registerStore);
router.post('/store/login', loginStore);

module.exports = router;
