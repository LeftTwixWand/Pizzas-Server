import { Router } from "express";
import connection from "../mongodb/connection.js";
import { ObjectId } from "mongodb";

var router = Router();

router.route("/cart").get(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("cartCollection");

  let result = await collection.find({}).toArray();
  response.json(result);
});

router.route("/cart/:pizzaId").get(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("cartCollection");

  const pizzaId = request.params.pizzaId;

  let result = await collection.findOne({ _id: new ObjectId(pizzaId) });
  if (!result) {
    return response.status(404).send("Pizza not found");
  }
  response.json(result);
});

router.route("/cart/:pizzaId").delete(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("cartCollection");

  const pizzaId = request.params.pizzaId;
  await collection.deleteOne({ _id: new ObjectId(pizzaId) });
  response.status(200).send();
});

router.route("/cart").post((request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("cartCollection");

  let pizzaFromRequest = request.body;

  pizzaFromRequest._id = new ObjectId(); // Generate a new id

  collection.insertOne(pizzaFromRequest).then(() => {
    response.status(200).send({
      message: "Pizza in the cart created successfully",
      pizza: pizzaFromRequest,
    });
  });
});

router.route("/cart/:pizzaId").put(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("cartCollection");

  const pizzaId = request.params.pizzaId;
  let existingPizza = await collection.findOne({
    _id: new ObjectId(pizzaId),
  });

  if (!existingPizza) {
    return response.status(404).json({ message: "Pizza not found" });
  }
  const updatedPizzaData = request.body;
  await collection.updateOne(
    { _id: new ObjectId(pizzaId) },
    { $set: updatedPizzaData }
  );
  response.status(200).send({ message: "Pizza updated successfully" });
});
export default router;
