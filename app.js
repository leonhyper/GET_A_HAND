var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const issues = require("./routes/issues");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/issues', issues.findAllIssues);
app.get('/issues/:id', issues.findById);
app.get('/issues/category/:category', issues.findByCate);
app.get('/issues/solved/:status', issues.findByStatus);


app.put('/issues/:id/:status', issues.updateStatus);

app.post('/issues',issues.addIssue);

app.delete('/issues/:id', issues.deleteIssue);

app.get('/solutions', issues.findAllSolutions);
app.get('/solutions/:id', issues.findSolutionById);
app.get('/issues/:id/solutions', issues.findByParent);
app.get('/solutions/:id/parent',issues.getParentIssue);

app.put('/solutions/:id/like', issues.increaseLike);

app.post('/solutions', issues.addSolution);

app.delete('/solutions/:id', issues.deleteSolution);

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
