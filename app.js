const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

mongoose
    .connect("mongodb://localhost:27017/passport-social-exercise", {
        useNewUrlParser: true,
        userUnifiedTopology: true
    })
    .then(() => {
        console.log("Conectada base de datos en puerto 27017");
    })
    .catch(error => {
        throw error;
    });

module.exports = app;
