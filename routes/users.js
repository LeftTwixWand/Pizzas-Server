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

  const registrationRequest = request.body;

  if (
    !registrationRequest.phone ||
    !registrationRequest.password ||
    !registrationRequest.name
  ) {
    return response.status(400).send({ message: "All variables are required" });
  }

  const existingUser = await collection.findOne({
    phone: registrationRequest.phone,
  });
  if (existingUser) {
    return response.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(registrationRequest.password, 10);

  const newUser = {
    _id: new ObjectId(),
    phone: registrationRequest.phone,
    name: registrationRequest.name,
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
    return response.status(401).json({ message: "Invalid phone number" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return response.status(401).json({ message: "Invalid password" });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await collection.updateOne(
    { _id: user._id },
    { $set: { token: refreshToken } }
  );

  response
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({ accessToken });
});

router.route("/logout").delete(async (request, response) => {
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

  return response
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({ accessToken, refreshToken });
});

export default router;
