const createError = require("http-errors");
const express = require("express");
const path = require("path");

const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const User = require("./models/User");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;
const app = express();

const bcrypt = require("bcryptjs");

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, callback) => {
    console.log("SERIALIZADOR");
    callback(null, user);
  });
  
passport.deserializeUser(async (id, callback) => {
    console.log("DESERIALIZADOR");

    try {
        const user = await User.findById(id);

        if (!user) return callback({ message: "El usuario no existe" });

        return callback(null, user);
    } catch (error) {
        console.log(error);
        return callback(error);
    }
});

const ops = {
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "http://localhost:8888/auth/spotify/callback"
}
passport.use(
    new SpotifyStrategy( opts, async, (accessToken, refreshToken, expires_in, profile, done) => {
        try {
            const user = await User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
                return done(err, user);
            
                next(null, user);
            });
        } catch(e) {
            ext(error);
        }
    })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
