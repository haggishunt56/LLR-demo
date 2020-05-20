const express = require('express');

const router = express.Router();

const queries = require('../db/queries');

router.get('/icecream', (req, res) => {
  queries
    .icecream
    .getAll()
    .then(icecreams => {
      res.json(icecreams);
    });
});

router.get('/icecream/:id', (req, res) => {
  queries
    .icecream
    .getOne(req.params.id)
    .then(icecreams => {
      res.json(icecreams);
    });
});

router.post('/icecream', (req, res) => {
  console.log(req.body);
  res.send('wat');
  queries
    .create(req.body)
    .then(result => {
      res.send(result);
    });
});

module.exports = router;
