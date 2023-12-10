import { Router } from "express";
import connection from "../mongodb/connection.js";
import { ObjectId } from "mongodb";

var router = Router();

router.route("/users").get(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("usersCollection");

  let result = await collection.find({}).toArray();
  response.json(result);
});

router.route("/users/:userId").get(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("usersCollection");

  const userId = request.params.userId;

  let result = await collection.findOne({ _id: new ObjectId(userId) });
  if (!result) {
    return response.status(404).send("User not found");
  }
  response.json(result);
});

router.route("/users").post(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("usersCollection");

  let userFromRequest = request.body;

  if (
    !userFromRequest.email &&
    !userFromRequest.name &&
    !userFromRequest.phone &&
    !userFromRequest.surname
  ) {
    return response.status(400).send({ message: "All variables is required" });
  }

  const existingUser = await collection.findOne({
    email: userFromRequest.email,
  });
  if (existingUser) {
    return response
      .status(400)
      .send({ message: "User with this email is already exists" });
  }

  userFromRequest._id = new ObjectId(); // Generate a new id

  collection.insertOne(userFromRequest).then(() => {
    response
      .status(200)
      .send({ message: "User created successfully", user: userFromRequest });
  });
});

router.route("/users/:userId").delete(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("usersCollection");

  const userId = request.params.userId;
  await collection.deleteOne({ _id: new ObjectId(userId) });
  response.status(200).send({ message: "User deleted successfully" });
});

// router.route("/users/:pizzaId").put(async (request, response) => {
//   let database = connection.getDatabase("pizzas-database");
//   let collection = database.collection("usersCollection");

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
