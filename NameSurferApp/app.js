const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

//db setup
mongoose.connect('mongodb://localhost/namedb');

// define schema
let namesurfSchema = new mongoose.Schema({
    name: String,
    "1900": Number,
    "1910": Number,
    "1920": Number,
    "1930": Number,
    "1940": Number,
    "1950": Number,
    "1960": Number,
    "1970": Number,
    "1980": Number,
    "1990": Number,
    "2000": Number
});

// create the model
let namesurf = mongoose.model('name', namesurfSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {title: 'NameSurfer'});
});

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

app.get('/namesurfer', (req, res) => {
    let input = capitalize(req.query.text);
    namesurf.findOne({ name: input }, (err, rec) => {
      if (err) {
          console.log(err);
          res.json( {result: '***DB ERROR***'} );
      }
      else if(rec == null) {
          res.json( {result: 'Name not found'} );
      }
      else {
          let jsonRes = res.json( rec );
      }
    })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
