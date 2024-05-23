import { Router } from "express";
import connection from "../mongodb/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../service/TokenService.js";

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

router.route("/users/:userId").delete(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("usersCollection");

  const userId = request.params.userId;

  await collection.deleteOne({ _id: new ObjectId(userId) });
  response.status(200).json({ message: "User successfully deleted" });
});

router.route("/registration").post(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("usersCollection");

  const { phone, password, name } = request.body;

  if (!phone || !password || !name) {
    return response.status(400).json({ message: "All variables are required" });
  }

  const existingUser = await collection.findOne({ phone });
  if (existingUser) {
    return response.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    _id: new ObjectId(),
    phone,
    name,
    password: hashedPassword,
    token: "",
  };

  await collection.insertOne(newUser);

  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  await collection.updateOne(
    { _id: newUser._id },
    { $set: { token: refreshToken } }
  );

  response.status(200).json({
    message: "User successfully registered",
    newUser,
    accessToken,
    refreshToken,
  });
});

router.route("/login").post(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("usersCollection");

  const { phone, password } = request.body;

  if (!phone || !password) {
    return response.status(400).json({ message: "All variables are required" });
  }

  const user = await collection.findOne({ phone });
  if (!user) {
    return response.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return response.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await collection.updateOne(
    { _id: user._id },
    { $set: { token: refreshToken } }
  );

  response.status(200).json({
    accessToken,
    refreshToken,
  });
});

router.route("/logout").delete(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("usersCollection");

  const token = request.body.token;

  if (!token) {
    return response.status(400).json({ message: "Token is required" });
  }

  user = await collection.findOne({ token });

  if (!user) {
    return response.status(404).send("Token not found");
  }

  await collection.updateOne({
    _id: user._id,
    $set: { token: "" },
  });

  return response.status(200).send("Logout success ");
});

router.route("/deleteUser").delete(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("usersCollection");

  const token = request.body.token;

  if (!token) {
    return response.status(400).json({ message: "Token is required" });
  }

  const result = await collection.deleteOne({ token });

  if (result.deletedCount === 1) {
    return response
      .status(200)
      .json({ message: "Logout success || Token has been deleted" });
  } else {
    return response.status(404).json({ message: "Token not found" });
  }
});

router.route("/refreshTokens").put(async (request, response) => {
  let database = connection.getDatabase("pizzas-database");
  let collection = database.collection("usersCollection");

  const token = request.body.token;

  if (!token) {
    return response.status(400).json({ message: "Token is required" });
  }

  const result = await collection.findOne({ token });

  if (!result) {
    return response.status(403).send("Invalid refresh token");
  }

  const isValidToken = await verifyToken(
    token,
    process.env.JWT_REFRESH_TOKEN_SECRET
  ).catch(() => null);

  if (!isValidToken) {
    return response.status(403).send("Invalid refresh token");
  }

  const accessToken = generateAccessToken({ _id: result._id });
  const refreshToken = generateRefreshToken({ _id: result._id });

  await collection.updateOne(
    { _id: result._id },
    { $set: { token: refreshToken } }
  );

  return response.status(200).json({
    accessToken,
    refreshToken,
  });
});

export default router;
