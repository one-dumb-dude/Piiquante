const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function signUpUser(req, res) {
  bcrypt.hash(req.body.password, 11, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing the password:", err);
      return res.status(500).send({error: err});
    } else {
      const newUser = new User({
        email: req.body.email,
        password: hashedPassword
      });

      // add mongoose unique validator to make sure emails arent duplicated
      newUser.save()
        .then(() => {
          console.log('User signed up successfully!');
          return res.status(200).send({message: 'User signed up successfully'});
        })
        .catch((err) => {
          console.error('an error occurred', err);
          return res.status(500).send({message: "Couldn't sign up user"});
        });
    }
  });
}

function loginUser(req, res) {

  const {email, password} = req.body;

  User.findOne({email})
    .then(user => {
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({message: 'Server error'});
        }

        if (result) {
          const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_PRIVATE_KEY,
            {expiresIn: '24h'}
          )

          res.status(200).send({
            userId: user._id,
            token: token
          });

        } else {
          return res.status(401).json({message: 'Invalid credentials'});
        }
      });

    })
    .catch(err => {
      console.error("Couldn't find user", err);
      return res.status(500).send(err);
    });
}



module.exports = {
  loginUser, signUpUser
};
