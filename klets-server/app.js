var express = require('express');
var path = require('path');
var logger = require('morgan');
var HttpError = require('./lib/http-error');

var index = require('./routes/index');
var rooms = require('./routes/rooms');
var messages = require('./routes/messages');

var app = express();

app.set('x-powered-by', false);

app.use(logger('dev'));

app.use('/', index);
app.use('/rooms', rooms);
app.use('/messages', messages);

// catch unhandled routes
app.use(function(req, res, next) {
  next(new HttpError(404, 'Not found'));
});

// generic error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).send(err.message);
});

module.exports = app;
