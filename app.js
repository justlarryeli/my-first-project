var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var UserRouter = require('./routes/User');
var session = require('express-session')
var AdminRouter = require('./routes/Admin');
var db = require('./config/connection');
const { engine } = require('express-handlebars');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'views', 'layout'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}));
process.env.PWD = process.cwd()
app.use(express.static(process.env.PWD + '/public/product-images'));
app.use(logger('dev'));
app.use(express.json());
app.use (session({secret:'Key',cookie:{maxAge:600000}}))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory
app.use(fileUpload());

db.connect((err) => {
    if (err) {
        console.error('Connection Error: ' + err);
    } else {
        console.log('Database connected to Server');
    }
});

app.use('/', UserRouter);
app.use('/Admin', AdminRouter);

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
