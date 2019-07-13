const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const context = {
    title: 'Hollywood Bowl Traffic Sux',
    class: 'home',
    year: new Date().getFullYear()
  };

  res.render('index', context);
});

module.exports = router;
