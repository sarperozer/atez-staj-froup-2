var express = require('express');
const {db} = require('../db/knex.db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/add', async function(req, res) {
    const { name, price } = req.body;

    await db('products').insert(
      { name, price }
    )
  
    return res.status(201).send({
      message: 'Succesfully created a product',
    })
  });

  router.post('/update', async function(req, res) {
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

  module.exports = router;