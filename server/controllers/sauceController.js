const Sauce = require('../models/Sauce.model');
const mongoose = require('mongoose');

function getSauces(req, res) {
  Sauce.find({})
    .then(sauce => {
      res.status(201).send(sauce);
    })
    .catch(err => {
      console.error('error: ', err);
      res.status(500).json({error: err});
    })
}

function getOneSauce(req, res) {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      res.status(201).json(sauce)
    })
    .catch(err => {
      // TODO: this catch block may not work because findById gives false positive
      console.error('Error: ', err);
    })
}

// TODO: an image shouldnt save if theres an error
function createOneSauce(req, res) {
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
  console.log('Sauce Liked!');
  console.log(req.body);

  const sauceId = req.params.id;
  const userId = req.body.userId;

  if (req.body.like === 1) {
    Sauce.findOneAndUpdate(
      {_id: sauceId},
      {$push: {usersLiked: userId}},
      {new: true}
    )
      .then((updatedDocument) => {
        if (updatedDocument) {

          return Sauce.updateOne(
            {_id: sauceId},
            {
              $inc: {
                likes: 1
              }
            }
          )

        } else {
          console.log('No matching document found.');
          res.status(500).json({error: 'No matching document found'});
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

    const ObjectId = mongoose.Types.ObjectId;

    const userObjId = new ObjectId(userId);

    Sauce.findOneAndUpdate(
      {_id: sauceId, usersLiked: userId},
      {
        $pull: {usersLiked: userId}
      }
    ).then(sauceLiked => {

      if (sauceLiked) {
        // objectId was present in userLikes and has been removed
        Sauce.findByIdAndUpdate(sauceLiked._id, {$inc: {likes: -1}}).then(() => {
          console.log("ObjectId found in userLikes and Likes decremented by 1");
          res.status(201).json({message: 'ObjectId found in userLikes and Likes decremented by 1'});
        });
      } else {
        // If objectId is not found in userLikes, proceed to check userDislikes
        Sauce.findOneAndUpdate(
          {_id: sauceId, usersDisliked: userId},
          {
            $pull: {usersDisliked: userId}
          }
        ).then(sauceDisliked => {
          if (sauceDisliked) {
            // objectId was present in userDislikes and has been removed
            // Decrement the Dislikes count
            Sauce.findByIdAndUpdate(
              sauceDisliked._id,
              {$inc: {dislikes: -1}}
            )
              .then(() => {
                console.log("ObjectId found in userDislikes and Dislikes decremented by 1");
                res.status(201).json({message: 'ObjectId found in userDislikes and Dislikes decremented by 1'});
              });
          } else {
            console.log("ObjectId not found in both userLikes and userDislikes");
            res.status(500).json({message: 'ObjectId not found in both userLikes and userDislikes'});
          }
        });
      }
    }).catch(error => {
      console.error('Error occurred:', error);
      res.status(500).json({error: error});
    });

  } else if (req.body.like === -1) {
    console.log('Sauce disliked!');
    Sauce.findOneAndUpdate(
      {_id: sauceId},
      {$push: {usersDisliked: userId}},
      {new: true}
    ).then(updatedDocument => {
      if (updatedDocument) {
        Sauce.updateOne(
          {_id: sauceId},
          {$inc: {dislikes: 1}}
        )
          .then(() => {
            console.log('Disliked successful');
            res.status(201).json({message: 'Disliked successful!'});
          })
          .catch(error => {
            console.error('Error:', error);
            res.status(500).json({error: error})
          });
      }
    })
      .catch(error => {
        console.error('Error: ', error);
        res.status(500).json({error: error});
      });
  }
}

module.exports = {
  getSauces, getOneSauce, createOneSauce, updateOneSauce, deleteASauce, likeASauce
}
