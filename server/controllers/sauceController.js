const Sauce = require('../models/Sauce.model');

function getSauces(req, res) {
  Sauce.find({})
    .then(sauce => {
      console.log(sauce);
      res.status(201).send(sauce);
    })
    .catch(err => {
      console.error('error: ', err);
      res.status(500).json({error: err});
    })
}

function getOneSauce(req, res) {
  Sauce.findById(req.body._id)
    .then((sauce) => {
      console.log('you found a sauce');
      res.status(201).json(sauce)
    })
    .catch(err => {
      console.error('Error: ', err);
    })
}

module.exports = {
  getSauces, getOneSauce
}
