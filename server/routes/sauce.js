const express = require("express");
const router = express.Router();
const sauceController = require('../controllers/sauceController');

router.get('/', sauceController.getSauces);

module.exports = router;
