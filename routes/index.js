var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var context = {
    title: 'a hollywood bowl concert tonight',
    class: 'home'
  };

  res.render('index', context);
});

module.exports = router;
