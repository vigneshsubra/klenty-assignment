const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./models/user');

const discussionRoutes = require('./routes/discussion-routes');

const discussionListRoutes = require('./routes/discussionList-routes');

const HttpError = require('./models/http-errors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(session({
  secret: "secretcode",
  resave: true,
  saveUninitialized: true
}));

app.use(cookieParser("secretcode"))
app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport);



app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.status(404).json({
      message:"No user exists"
    });
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send('Successfully authenticated');
        console.log(req.user);
      });
    }
  })(req, res, next);
})

app.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User already exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword
      });
      await newUser.save();
      res.send("User created");
    }
  })
})

app.get("/user", (req, res) => {
  res.send(req.user);
})

app.use('/api/discussion', discussionRoutes);

app.use('/api/discussion-list', discussionListRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find the page you are looking for.', 404);
  next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured' });
});

mongoose
  .connect('mongodb+srv://vicky:vickymongo@cluster0.jscdw.mongodb.net/discussions?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
