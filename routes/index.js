const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const context = {
    title: 'a hollywood bowl concert tonight',
    class: 'home'
  };

  res.render('index', context);
});

module.exports = router;
