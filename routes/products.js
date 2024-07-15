var express = require('express');
const {db} = require('../db/knex.db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyAuth, verifyCompany } = require('./auth');
var router = express.Router();

//Adding New Product
router.post('/add',verifyAuth, verifyCompany, async function(req, res) {
  const { name, price, stock } = req.body;

  if(!name || ! price || !stock){
    return res.status(400).send({
      message: 'name, price or stock is missing'
    })
  }

  await db('products').insert(
    { name, price, stock }
  )

  return res.status(201).send({
    message: 'Succesfully created a product',
    name, price, stock
  })
});

//Updating Existing Product
router.patch('/update',verifyAuth, verifyCompany, async function(req, res) {
  const { productId, newPrice, newStock } = req.body;

  const product = await db('products').select('*').where('id', productId).first();

  if(!newPrice || !newStock){
    return res.status(400).send({
      message: 'Please enter new price and new stock number!'
    })
  }

  if (!product) {
    return res.status(400).send({
      message: 'There is no product with given name'
    })
  };

  await db("products").where('id', productId).update({"price": newPrice, "stock": newStock});

  return res.status(201).send({
    message: 'Succesfully updated the product',
  })
});

//Deleting Existing Product
router.delete('/delete/:id',verifyAuth, verifyCompany, async function(req, res) {

  if(!req.params.id){
    return res.status(400).send({
      message: 'id is missing'
    })
  }

  const product = await db('products').select('*').where('id', req.params.id);

  if (!product) {
    return res.status(400).send({
      message: 'There is no product with given name'
    })
  };

  await db('products').del().where('id', req.params.id);

  return res.status(201).send({
    message: 'Succesfully deleted a product',
  })
});

/* GET products listing. */
router.get('/list', verifyAuth, async function(req, res, next) {
  const productData = await db('products').select('*');
  res.json(productData);
});

/* GET product info with given product id. */
router.get('/list/:id', verifyAuth, async function(req, res, next) {

  if(!req.params.id){
    return res.status(400).send({
      message: 'id is missing'
    })
  }

  const productData = await db('products').select('*').where("id", req.params.id);
  res.json(productData);
});

/* GET product with given name. */
router.post('/list/:searchParam', verifyAuth, async function(req, res, next) {
  const {name} = req.body;

  if(!name){
    return res.status(400).send({
      message: 'Product name is missing'
    })
  }

  const productData = await db('products').select('*').where("name", name);
  res.json(productData);
});

module.exports = router;