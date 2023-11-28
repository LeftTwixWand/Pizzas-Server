import express from "express";
import cors from "cors";
import path from "path";
import dirname from "es-dirname";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import pizzasRoutes from "./routes/pizzas.js";
import indexRouter from "./routes/index.js";
import cartRouter from "./routes/cart.js";

const app = express();

app.set("views", path.join(dirname(), "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(dirname(), "./public")));

app.use(indexRouter);
app.use(pizzasRoutes);
app.use(cartRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

export default app;
