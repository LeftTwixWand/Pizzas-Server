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
    return response.status(404).json({ message: "User not found" });
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
  try {
    let database = connection.getDatabase("pizzas-database");
    let collection = database.collection("usersCollection");

    const registrationRequest = request.body;
    if (
      !registrationRequest.phone &&
      !registrationRequest.password &&
      !registrationRequest.name
    ) {
      return response
        .status(400)
        .send({ message: "All variables is required" });
    }

    const existingUser = await collection.findOne({
      phone: registrationRequest.phone,
    });
    if (existingUser) {
      return response.status(400).json({ message: "User is already exists" });
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
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server Error" });
  }
});

router.route("/login").post(async (request, response) => {
  try {
    let database = connection.getDatabase("pizzas-database");
    let collection = database.collection("usersCollection");

    const { phone, password } = request.body;

    if (!phone && !password) {
      return response
        .status(400)
        .json({ message: "All variables is required" });
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

    response
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ accessToken });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server Error" });
  }
});

router.route("/logout").delete(async (request, response) => {
  try {
    let database = connection.getDatabase("pizzas-database");
    let collection = database.collection("usersCollection");

    const token = request.body.token;
    const result = await collection.deleteOne({ token });

    if (result.deletedCount === 1) {
      response
        .status(200)
        .json({ message: "Logout success || Token has been deleted" });
    } else {
      response.status(404).json({ message: "Token not found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server Error" });
  }
});

router.route("/refreshTokens").put(async (request, response) => {
  try {
    let database = connection.getDatabase("pizzas-database");
    let collection = database.collection("usersCollection");

    const token = request.body.token;

    const result = await collection.findOne({ token });
    if (!result) {
      return response.status(403).send("Invalid refresh token ");
    }

    try {
      await verifyToken(token, process.env.JWT_REFRESH_TOKEN_SECRET);
    } catch (error) {
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
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Server Error" });
  }
});

export default router;
