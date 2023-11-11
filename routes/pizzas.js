var pizzas = require("../public/pizzas.json");

var express = require("express");
const { request } = require("../app");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json(pizzas);
});

module.exports = router;
