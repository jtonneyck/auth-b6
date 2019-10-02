var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/profile', function(req, res, next) {
  res.render("profile")
});

router.get("/friends", function(req,res){
  res.render("friends")
})

module.exports = router;
