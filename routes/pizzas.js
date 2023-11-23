import { Router } from "express";
import connection from "../mongodb/connection.js";

var router = Router();

router.route("/pizzas/").get(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("pizzasCollection");

  let result = await collection.find({}).toArray();
  response.json(result);
});

// router.get("/:pizzaId", function (req, res, next) {
//   let pizza = data.find((item) => item._id === req.params.pizzaId);
//   res.header("Access-Control-Allow-Origin", "*");
//   res.json(pizza);
// });

// router.put("/:pizzaId", function (req, res, next) {
//   let pizzaFromRequest = req.body;

//   let indexOfExistingPizza = data.findIndex(
//     (item) => item._id === req.params.pizzaId
//   );
//   data[indexOfExistingPizza] = pizzaFromRequest;

//   res.sendStatus(200);
// });

// router.delete("/:pizzaId", function (req, res, next) {
//   let indexOfExistingPizza = data.findIndex(
//     (item) => item._id === req.params.pizzaId
//   );
//   data.splice(indexOfExistingPizza, 1);

//   res.sendStatus(200);
// });

// routes.post("/", function (req, res, next) {
//   let pizzaFromRequest = req.body;
//   pizzaFromRequest._id = Math.random().toString(36).substr(2, 9); // Generate a new id

//   data.push(pizzaFromRequest);

//   res.sendStatus(200);
// });

//Sort
// router.get("/:sort=price", function (req, res, next) {
//   let sortedPizzas = data.sort((a, b) => b.price - a.price);

//   res.header("Access-Control-Allow-Origin", "*");
//   res.json(sortedPizzas);
// });

export default router;
