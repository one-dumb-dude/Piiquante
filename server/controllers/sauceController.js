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
  console.log(req.params)
  console.log(req.params.id);
  Sauce.findById(req.params.id)
    .then((sauce) => {
      console.log('you found a sauce');
      console.log(sauce);
      res.status(201).json(sauce)
    })
    .catch(err => {
      console.error('Error: ', err);
    })
}

module.exports = {
  getSauces, getOneSauce
}
