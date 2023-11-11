var express = require("express");
var router = express.Router();

const data = [
  {
    _id: "6543a285b0febf6775b0d417",
    imageUrl:
      "https://dodopizza.azureedge.net/static/Img/Products/f035c7f46c0844069722f2bb3ee9f113_584x584.jpeg",
    title: "Pepperoni with pepper",
    types: [0, 1],
    sizes: [26, 30, 40],
    price: 203,
    category: 0,
    rating: 4,
  },
  {
    _id: "6543a285b0febf6775b0d418",
    imageUrl:
      "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/2ffc31bb-132c-4c99-b894-53f7107a1441.jpg",
    title: "4 cheeses",
    types: [0],
    sizes: [26, 40],
    price: 145,
    category: 1,
    rating: 6,
  },
  {
    _id: "6543a285b0febf6775b0d419",
    imageUrl:
      "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/6652fec1-04df-49d8-8744-232f1032c44b.jpg",
    title: "Kozatska",
    types: [0],
    sizes: [26, 40],
    price: 195,
    category: 1,
    rating: 4,
  },
  {
    _id: "6543a285b0febf6775b0d41a",
    imageUrl:
      "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/af553bf5-3887-4501-b88e-8f0f55229429.jpg",
    title: "Mexico",
    types: [1],
    sizes: [26, 30, 40],
    price: 175,
    category: 2,
    rating: 2,
  },
  {
    _id: "6543a285b0febf6775b0d41b",
    imageUrl:
      "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/b750f576-4a83-48e6-a283-5a8efb68c35d.jpg",
    title: "Cheeseburger pizza",
    types: [0, 1],
    sizes: [26, 30, 40],
    price: 115,
    category: 3,
    rating: 8,
  },
  {
    _id: "6543a285b0febf6775b0d41c",
    imageUrl:
      "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/1e1a6e80-b3ba-4a44-b6b9-beae5b1fbf27.jpg",
    title: "Crazy pepperoni",
    types: [0],
    sizes: [30, 40],
    price: 280,
    category: 2,
    rating: 2,
  },
  {
    _id: "6543a285b0febf6775b0d41d",
    imageUrl:
      "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/d2e337e9-e07a-4199-9cc1-501cc44cb8f8.jpg",
    title: "Pepperoni",
    types: [0, 1],
    sizes: [26, 30, 40],
    price: 275,
    category: 1,
    rating: 9,
  },
  {
    _id: "6543a285b0febf6775b0d41e",
    imageUrl:
      "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/d48003cd-902c-420d-9f28-92d9dc5f73b4.jpg",
    title: "Margarita",
    types: [0, 1],
    sizes: [26, 30, 40],
    price: 450,
    category: 4,
    rating: 10,
  },
  {
    _id: "6543a285b0febf6775b0d41f",
    imageUrl:
      "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/ec29465e-606b-4a04-a03e-da3940d37e0e.jpg",
    title: "4 seasons",
    types: [0, 1],
    sizes: [26, 30, 40],
    price: 195,
    category: 5,
    rating: 10,
  },
  {
    _id: "6543a285b0febf6775b0d420",
    imageUrl:
      "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/30367198-f3bd-44ed-9314-6f717960da07.jpg",
    title: "Vegetables and mushrooms",
    types: [0, 1],
    sizes: [26, 30, 40],
    price: 185,
    category: 5,
    rating: 7,
  },
];

/* GET pizzas listing. */
router.get("/", function (req, res, next) {
  res.json(data);
});

router.get("/:pizzaId", function (req, res, next) {
  let pizza = data.find((item) => item._id === req.params.pizzaId);
  res.json(pizza);
});

router.put("/:pizzaId", function (req, res, next) {
  let pizzaFromRequest = req.body;

  let indexOfExistingPizza = data.findIndex(
    (item) => item._id === req.params.pizzaId
  );
  data[indexOfExistingPizza] = pizzaFromRequest;

  res.sendStatus(200);
});

router.delete("/:pizzaId", function (req, res, next) {
  let indexOfExistingPizza = data.findIndex(
    (item) => item._id === req.params.pizzaId
  );
  data.splice(indexOfExistingPizza, 1);

  res.sendStatus(200);
});

router.post("/", function (req, res, next) {
  let pizzaFromRequest = req.body;
  pizzaFromRequest._id = Math.random().toString(36).substr(2, 9); // Generate a new id

  data.push(pizzaFromRequest);

  res.sendStatus(200);
});

module.exports = router;
