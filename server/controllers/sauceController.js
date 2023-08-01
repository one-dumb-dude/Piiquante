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
      // TODO: this catch block may not work because findById gives false positive
      console.error('Error: ', err);
    })
}

// TODO: an image shouldnt save if theres an error
function createOneSauce(req, res) {
  console.log('creating a Salsa!');
  const sauceData = JSON.parse(req.body.sauce);

  const newSauce = new Sauce({
    userId: sauceData.userId,
    name: sauceData.name,
    manufacturer: sauceData.manufacturer,
    description: sauceData.description,
    mainPepper: sauceData.mainPepper,
    imageUrl: 'http://localhost:3000/images/' + req.file.filename,
    heat: sauceData.heat
  });

  newSauce.save()
    .then(savedSauce => {
      console.log('Sauce saved successfully:', savedSauce);
      res.status(201).json({message: 'Sauce saved successfully'})
    })
    .catch(err => {
      console.error('Error saving sauche:', err);
      res.status(500).json({error: err});
    });
}

module.exports = {
  getSauces, getOneSauce, createOneSauce
}
