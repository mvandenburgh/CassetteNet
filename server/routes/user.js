const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const auth = require('../auth/auth');
const { User } = require('../models');

const router = express.Router();

//POST new user route (optional, everyone has access)
router.post('/signup', auth.optional, async (req, res) => {
    const { username, password, email } = req.body;

    if(!email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!username) {
        return res.status(422).json({
            errors: {
                username: 'is required',
            },
        });
    }

    if(!password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    const newUser = new User({ username, email });

    newUser.setPassword(password);

    // TODO: add error handling
    await newUser.save();

    res.json({ user: newUser.toAuthJSON() });
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { username, password } = req.body;

  if(!user.username) {
    return res.status(422).json({
      errors: {
        username: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) return next(err);

    if (passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
});

// //GET current route (required, only authenticated users have access)
// router.get('/current', auth.required, (req, res, next) => {
//   const { payload: { id } } = req;

//   return Users.findById(id)
//     .then((user) => {
//       if(!user) {
//         return res.sendStatus(400);
//       }

//       return res.json({ user: user.toAuthJSON() });
//     });
// });

module.exports = router;
