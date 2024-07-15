var express = require('express');
const {db} = require('../db/knex.db');
const { verifyAuth, verifyCompany} = require('./auth');
var router = express.Router();

//Adding Product to cart
router.post('/add',verifyAuth, async function(req, res) {
  
  const { product, amount } = req.body;
  
  if(!product || !amount){
    return res.status(400).send({
      message: 'Product name or amount is missing'
    })
  }

  const productData = await db('products').select('*').where('name', product);

  if(!productData){
    return res.status(400).send({
      message: 'There is no product with given name'
    })
  }

  await db('carts').insert(
    { product, amount, userId: req.user.id}
  )

  return res.status(201).send({
    message: 'Product succesfully added',
  })
});

//Deleting the cart with given id
router.delete('/delete/:id',verifyAuth, verifyCompany, async function(req, res) {

  if(!req.params.id){
    return res.status(400).send({
      message: 'id is missing'
    })
  }

  const product = await db('carts').select('*').where('id', req.params.id);

  if (!product) {
    return res.status(400).send({
      message: 'There is no product in the cart with given id'
    })
  };

  await db('carts').del().where('id', req.params.id);

  return res.status(201).send({
    message: 'Succesfully deleted the cart',
  })
})


/* GET cart listing. */
router.get('/list/:cartId', verifyAuth, verifyCompany , async function(req, res, next) {

  if(!req.params.cartId){
    return res.status(400).send({
      message: 'CartId is missing'
    })
  }

  const cartData = await db('carts').select('*').where("id", req.params.cartId);
  res.json(cartData);
});

/* GET given user's cart */
router.get('/list/usr/:userId', verifyAuth, verifyCompany, async function(req, res, next) {
  if(!req.params.userId){
    return res.status(400).send({
      message: 'userId is missing'
    })
  }
  const userCartData = await db('carts').select('*').where("userId", req.params.userId);
  res.json(userCartData);
});

  module.exports = router;