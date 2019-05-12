const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');

const MainController = require('./routes/MainController');
const placeController = require('./routes/PlaceController');
const userController = require('./routes/UserController');
const createPlaces = require('./routes/CreatePlaces');


const DBManager = require("./models/DBManager");
DBManager.connect(function(){});
const ModelManager = require("./models/ModelManager");
const UpdateController = require("./routes/UpdateController");
ModelManager.updater = UpdateController;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'needs to be changed',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false /*till https*/ },
  maxAge: Date.now() + (60 * 60 * 1000),
}));
app.use(cors({
  origin: ['https://musync-app.herokuapp.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(function(req, res, next) {
  res.on("finish", function() {
    // Commit DB changes
    ModelManager.commitChanges();
  });

  next();
});


app.use('/place', placeController);
app.use('/user', userController);
app.use('/test', createPlaces);
app.use('/', MainController);


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
  res.send('error');
});

module.exports = app;
