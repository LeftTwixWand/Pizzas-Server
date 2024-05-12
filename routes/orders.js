import { Router } from "express";
import connection from "../mongodb/connection.js";
import { ObjectId } from "mongodb";

var router = Router();

router.route("/orders").get(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("ordersCollection");

  let result = await collection.find({}).toArray();
  response.json(result);
});

router.route("/orders/:orderId").get(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("ordersCollection");

  const orderId = request.params.orderId;

  let result = await collection.findOne({ _id: new ObjectId(orderId) });
  if (!result) {
    return response.status(404).send("Order not found");
  }
  response.json(result);
});

router.route("/orders").post(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("ordersCollection");

  let orderRequest = request.body;

  if (
    !orderRequest.email &&
    !orderRequest.name &&
    !orderRequest.phone &&
    !orderRequest.surname
  ) {
    return response.status(400).send({ message: "All variables is required" });
  }

  // const existingUser = await collection.findOne({
  //   email: userFromRequest.email,
  // });
  // if (existingUser) {
  //   return response
  //     .status(400)
  //     .send({ message: "User with this email is already exists" });
  // }

  orderRequest._id = new ObjectId(); // Generate a new id

  collection.insertOne(orderRequest).then(() => {
    response
      .status(200)
      .send({ message: "Order created successfully", order: orderRequest });
  });
});

router.route("/orders/:orderId").delete(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("ordersCollection");

  const orderId = request.params.orderId;
  await collection.deleteOne({ _id: new ObjectId(orderId) });
  response.status(200).send({ message: "Order deleted successfully" });
});

// router.route("/users/:pizzaId").put(async (request, response) => {
//   let database = connection.getDatabase("pizzas-database");
//   let collection = database.collection("ordersCollection");

//   const pizzaId = request.params.pizzaId;
//   let existingPizza = await collection.findOne({
//     _id: new ObjectId(pizzaId),
//   });

//   if (!existingPizza) {
//     return response.status(404).json({ message: "Pizza not found" });
//   }
//   const updatedPizzaData = request.body;
//   await collection.updateOne(
//     { _id: new ObjectId(pizzaId) },
//     { $set: updatedPizzaData }
//   );
//   response.status(200).send({ message: "Pizza updated successfully" });
// });

export default router;
