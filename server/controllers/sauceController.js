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

function updateOneSauce(req, res) {
  console.log('Update a Sauce');
  const id = req.params.id;

  if (req.body.sauce) {
    console.log('Sauce with File!')
    const sauceData = JSON.parse(req.body.sauce);
    Sauce.updateOne(
      {_id: id},
      {
        $set: {
          userId: sauceData.userId,
          name: sauceData.name,
          manufacturer: sauceData.manufacturer,
          description: sauceData.description,
          mainPepper: sauceData.mainPepper,
          imageUrl: 'http://localhost:3000/images/' + req.file.filename,
          heat: sauceData.heat,
        }
      })
      .then(() => {
        console.log("Sauced was updated successfully");
        res.status(201).json({message: 'Sauce was updated successfully'});
      })
      .catch((err) => {
        console.error("Error updating sauce:", err);
        res.status(500).json({message: 'Error updating sauce'});
      });

  } else {
    console.log('Sauce with no file!')
    Sauce.updateOne(
      {_id: id},
      {
        $set: {
          userId: req.body.userId,
          name: req.body.name,
          manufacturer: req.body.manufacturer,
          description: req.body.description,
          mainPepper: req.body.mainPepper,
          heat: req.body.heat,
        }
      })
      .then(() => {
        console.log("Sauced was updated successfully");
        res.status(201).json({message: 'Sauce was updated successfully'});
      })
      .catch((err) => {
        console.error("Error updating sauce:", err);
        res.status(500).json({message: 'Error updating sauce'});
      })
  }
  // Sauce.updateOne({})
}

function deleteASauce(req, res) {
  console.log('Delete a Sauce');
  Sauce.deleteOne({_id: req.params.id})
    .then(() => {
      console.log('Sauce was deleted successfully');
      res.status(201).json({message: 'Sauce was deleted successfully'});
    })
    .catch((err) => {
      console.error('Error deleting sauce:', err);
      res.status(500).json({message: 'Error deleting sauce'});
    })
}

function likeASauce(req, res) {
  console.log('Like a sauce');
  console.log(req.body);

  const id = req.params.id;
  const userId = req.body.userId;

  if (req.body.like === 1) {
    Sauce.findOneAndUpdate(
      {_id: id},
      {$push: {usersLiked: userId}},
      {new: true}
    )
      .then((updatedDocument) => {
        if (updatedDocument) {
          console.log('Updated Document', updatedDocument);

          return Sauce.updateOne(
            {_id: id},
            {
              $inc: {
                likes: 1
              }
            }
          )

        } else {
          console.log('No matching document found.');
        }
      })
      .then((userLikedUpdate) => {
        if (userLikedUpdate) {
          console.log('user Liked transaction complete')
          res.status(201).json({message: 'Liking a sauce was successful'})
        }
      })
      .catch((error) => {
        console.error('Error liking a sauce', error);
        res.status(500).json({message: 'Error liking a sauce'})
      });
  } else if (req.body.like === 0) {
    Sauce.updateMany(
      {
        _id: id,
        $or: [{usersLiked: userId}, {usersDisliked: userId}]
      },
      {
        $pull: {
          usersLiked: userId, usersDisliked: userId
        }
      }
    )
      .then((updatedLikes) => {
        console.log('Like/dislike is now neutral');
        res.status(201).json({message: 'Like/dislike is now neutral'});
      })
      .catch(err => {
        res.status(500).json({error: err});
      })
  }


}

module.exports = {
  getSauces, getOneSauce, createOneSauce, updateOneSauce, deleteASauce, likeASauce
}
