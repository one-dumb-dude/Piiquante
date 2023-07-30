const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const sauceController = require('../controllers/sauceController');

router.get('/', auth, sauceController.getSauces);
router.get('/:id', sauceController.getOneSauce);

module.exports = router;
