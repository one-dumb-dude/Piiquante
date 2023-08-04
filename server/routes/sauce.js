const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceController = require('../controllers/sauceController');

router.get('/', auth, sauceController.getSauces);
router.get('/:id', auth, sauceController.getOneSauce);
router.post('/', auth, multer, sauceController.createOneSauce);
router.put('/:id', auth, multer, sauceController.updateOneSauce);
router.delete('/:id', auth, sauceController.deleteASauce);
router.post('/:id/like', auth, sauceController.likeASauce);

module.exports = router;
