var express = require('express');
const {db} = require('../db/knex.db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyAuth = require('./auth');
//const verifyCompany = require('./auth');
var router = express.Router();

function verifyCompany(req, res, next) {
  if (req.user.userType !== 'company') {
      return res.status(403).send({
          message: 'Access denied. Only companies can perform this action.'
      });
  }
  next();
}

//Adding New Product
router.post('/add',verifyAuth, verifyCompany, async function(req, res) {
    const { name, price, stock } = req.body;

    await db('products').insert(
      { name, price, stock }
    )
  
    return res.status(201).send({
      message: 'Succesfully created a product',
    })
  });

  //Updating Existing Product
  router.post('/update',verifyAuth, verifyCompany, async function(req, res) {
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

  //Deleting Existing Product
  router.post('/delete/:id',verifyAuth, verifyCompany, async function(req, res) {
    const { userId } = req.body;
  
    const product = await db('products').select('*').where('id', userId);
  
    if (!product) {
      return res.status(400).send({
        message: 'There is no product with given name'
      })
    };
  
    await db('products').del().where('id', userId);

    return res.status(201).send({
      message: 'Succesfully deleted a product',
    })
  })


  /* GET products listing. */
router.get('/list', verifyAuth, async function(req, res, next) {
  const productData = await db('products').select('*');
  res.json(productData);
});

/* GET products listing. */
router.get('/list/:id', verifyAuth, async function(req, res, next) {
  const userId = req.body;
  const productData = await db('products').select('*').where("id", userId);
  res.json(productData);
});

/* GET products listing. */
router.post('/list/:searchParam', verifyAuth, async function(req, res, next) {
  const {name} = req.body;
  const productData = await db('products').select('*').where("name", name);
  res.json(productData);
});

  module.exports = router;