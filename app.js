import express from "express";
import cors from "cors";
import path, { dirname } from "path";
// import * as path from "path";
import httpErrors from "http-errors";
import logger from "morgan";
import connection from "./mongodb/connection.js";
import pizzasRoutes from "./routes/pizzas.js";
import {} from "dotenv/config";
import { URL } from "url";

const app = express();
let connection = await connection.connectToCluster();

console.log("next step");
// view engine setup
// app.set("views", path.join(dirname, "views"));
app.set("views", new URL("views", import.meta.url).pathname);
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(new URL("public", import.meta.url).pathname));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(httpErrors[404]);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use(pizzasRoutes);

export default app;
