var express = require('express');
const {db} = require('../db/knex.db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyAuth, verifyCompany } = require('./auth');
var router = express.Router();

/* GET users listing. */
router.get('/list', verifyAuth, verifyCompany, async function(req, res, next) {
  const user = req.user;
  const usersData = await db('users').select('email', 'name', 'surname');
  res.json(usersData);
});

/* GET user with given id. */
router.get('/list/:id', verifyAuth, verifyCompany, async function(req, res, next) {
  if (!req.params.id) {
    return res.status(400).send({
      message: 'Please give user id!'
    })
  };

  const usersData = await db('users').select('*').where("id", req.params.id);
  res.json(usersData);
});

router.post('/signup', async function(req, res) {
  const { username, password, name, surname, email, userType } = req.body;

  // userType = user | company

  if (!email && !password) {
    return res.status(400).send({
      message: 'email or password missing',
    });
  };

  const user = await db('users').select('*').where('email', email).first();

  if (user) {
    return res.status(400).send({
      message: 'you are already have an account'
    })
  };

  const cryptedPassword = await bcrypt.hash(password, 8);

  await db('users').insert(
    { username, password: cryptedPassword, name, surname, email, userType }
  )

  return res.status(201).send({
    message: 'user has successfully created',
  })
});

router.post('/login', async function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: 'email or password is missing'
    })
  };

  const user = await db('users').select('*').where('email', email).first();

  if (!user) {
    return res.status(400).send({
      message: 'There is no account with given email'
    })
  };

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send({
      message: 'There is no account with given email'
    })
  }

  const token = jwt.sign({  id: user.id, email: email, userType: user.userType }, process.env.SECRET_KEY);

  return res.status(200).send({
    message: 'successfully logged in',
    token
  });
});

/* Delete user with given id. */
router.delete('/delete/:id', verifyAuth, verifyCompany, async function(req, res) {

  if (!req.params.id) {
    return res.status(400).send({
      message: 'Please give user id!'
    })
  };
  
  await db('users').del().where('id', req.params.id);
});

module.exports = router;
