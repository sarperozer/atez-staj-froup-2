var express = require('express');
const {db} = require('../db/knex.db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyAuth = require('./auth');
var router = express.Router();

router.post('/add',verifyAuth, async function(req, res) {
    const { name, price, stock } = req.body;

    await db('products').insert(
      { name, price, stock }
    )
  
    return res.status(201).send({
      message: 'Succesfully created a product',
    })
  });

  router.post('/update',verifyAuth, async function(req, res) {
    const { name, newPrice, newStock } = req.body;

    const product = await db('products').select('*').where('name', name).first();

    if (!product) {
      return res.status(400).send({
        message: 'There is no product with given name'
      })
    };

    await db("products").where('name', name).update("price", newPrice);
    await db("products").where('name', name).update("stock", newStock);
  
    return res.status(201).send({
      message: 'Succesfully updated the product',
    })
  });

  router.post('/delete',verifyAuth, async function(req, res) {
    const { name } = req.body;
  
    const product = await db('products').select('*').where('name', name);
  
    if (!product) {
      return res.status(400).send({
        message: 'There is no product with given name'
      })
    };
  
    await db('products').del().where('name', name);
  })

  module.exports = router;