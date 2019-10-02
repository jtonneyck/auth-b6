var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var session = require("express-session");
var app = express();
var hbs = require('hbs');

hbs.registerPartials(__dirname + '/views/partials');

app.use(session({
  secret: 'keyboard cat',
  expires: {maxAge: 6000},
  saveUninitialized: true
}))

mongoose.connect("mongodb://localhost/auth-demo")
  .then(()=> {
    console.log("connected to mongodb");
  })
  .catch((err)=> {
    console.log("Not connected to mongodb error", err);
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require("./routes/auth");

app.use("/users", (req,res,next)=> {
  if(!req.session.user) res.send("Not logged in. Get lost!")
  else next()
})

app.use("/", (req,res,next)=> {
  if(req.session.user) res.locals.user = req.session.user;
  next()
})

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
