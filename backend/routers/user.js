const express = require('express');
const zod = require('zod');
import jwt from 'jsonwebtoken';
import User, { Account } from '../db/dbElegant';
import JWT_SECRET from '../config';
import authMiddleware from './middleware';

const router = express.Router();

const userSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  firstName: zod.string(),
});

router.post('/signup', async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: 'Email already taken / Incorrect inputs',
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: 'Email already taken/Incorrect inputs',
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;

  /// ----- Create new account ------

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  /// -----  ------

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: 'User created successfully',
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post('/signin', async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: 'Incorrect inputs ',
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  const userID = user._id;

  if (user) {
    const token = jwt.sign(
      {
        userID,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
    return;
  }

  res.status(411).json({
    message: 'Error while logging in',
  });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put('/', authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.json({
      msg: 'Error while updating information',
    });
  }

  await User.updateOne(req.body, {
    _id: req.userId,
  });

  res.json({
    msg: 'Information updated successful',
  });
});

router.get('/bulk', async (req, res) => {
  const filter = req.query.filter || '';

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => {
      username: user.username;
      firstName: user.firstName;
      lastName: user.lastName;
      _id: user._id;
    }),
  });
});

module.exports = router;
