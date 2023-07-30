const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sauceSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, required: true},
  name: {type: String, required: true},
  manufacturer: {type: String, required: true},
  description: {type: String, required: true},
  mainPepper: {type: String, required: true},
  imageUrl: {type: String, required: true},
  heat: {type: Number, required: true, min:1, max: 10},
  likes: {type: Number, default: 0},
  dislikes: {type: Number, default: 0},
  userLiked: [{type: Schema.Types.ObjectId, ref: 'User'}],
  usersDisliked: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

const Sauce = mongoose.model('Sauce', sauceSchema);

module.exports = Sauce;
