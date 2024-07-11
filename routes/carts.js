var express = require('express');
const {db} = require('../db/knex.db');
const { verifyAuth, verifyCompany} = require('./auth');
var router = express.Router();

//Adding Product to cart
router.post('/add',verifyAuth, async function(req, res) {
    const { product, amount } = req.body;

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

  //Deleting Product from cart
  router.delete('/delete/:id',verifyAuth, verifyCompany, async function(req, res) {
  
    const product = await db('carts').select('*').where('id', req.params.id);
  
    if (!product) {
      return res.status(400).send({
        message: 'There is no product in the cart with given id'
      })
    };
  
    await db('carts').del().where('id', req.params.id);

    return res.status(201).send({
      message: 'Succesfully deleted a product from cart',
    })
  })


  /* GET cart listing. */
router.get('/list/:cartId', verifyAuth, verifyCompany , async function(req, res, next) {
  const cartData = await db('carts').select('*').where("id", req.params.cartId);
  res.json(cartData);
});

/* GET products listing. */
router.get('/list/usr/:userId', verifyAuth, verifyCompany, async function(req, res, next) {
  const userCartData = await db('carts').select('*').where("userId", req.params.userId);
  res.json(userCartData);
});

  module.exports = router;