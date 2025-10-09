const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller.js');

// GET / - Trang chủ
router.get('/', homeController.getHome);

module.exports = router;