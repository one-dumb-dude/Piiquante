const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const baseFileName = path.basename(file.originalname, path.extname(file.originalname));
    const fileName = baseFileName.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, fileName + '_' + Date.now() + '.' + extension);
  }
});

module.exports = multer({
  storage: storage
}).single('image');
