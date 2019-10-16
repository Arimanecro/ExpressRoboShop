const express = require('express');
const router = express.Router();
const graphqlRequest = require('../graphql/graphQuery');
const Response = require('../models/ResponseBundle');
const order = require('../models/Order');
const search = require('../models/Search');

router.param('page', function (req, res, next, page) {
  req.params.page = page.match("^[0-9]+$") ? Number(page) : 1;
  next();
});

router.get('/', (req, res) => {
  let query = {query: `{ home { id title url img_small img_medium price } }`};
  graphqlRequest(req, res, query, 'homeView');
})
.get('/category/:category', (req, res) => {
  let query = { query: `{ category(cat:"${req.params.category}") { id title url img_small img_medium price category} }`};
  graphqlRequest(req, res, query, 'categoryView');
})
.get('/category/:category/:page', (req, res) => {
  let query = { query: `{ categoryPagination(cat:"${req.params.category}", page:${req.params.page}) { id title url img_small img_medium price category} }`};
  graphqlRequest(req, res, query, 'categoryView');
})
.get('/item/:item', (req, res) => {
  let query = { query: `{ item(title:"${req.params.item}") { id title url img_small img_medium img_original description price category} }`};
  graphqlRequest(req, res, query, 'itemView', true);
})
.get('/basket', (req, res) => {
  Response.staticBundle(res, ['basketView'], 'Basket');
})
.get('/wishlist', (req, res) => {
  Response.staticBundle(res, ['basketView'], 'WishList');
})
.get('/order', (req, res) => {
  Response.staticBundle(res, ['orderView'], {good:false, errors:[]});
})
.post('/order',(req, res) => {
  order.Index(req, res);
})
.get('/search/:word',(req, res) => {
  search.Index(req, res);
})
.get('/search/:word/:page',(req, res) => {
  search.Index(req, res);
})
.post('/search/:word',(req, res) => {
  search.Index(req, res);
})
.get('/list-of-orders', (req, res) => {
  Response.staticBundle(res, ['listOfOrdersView']);
})

module.exports = router;