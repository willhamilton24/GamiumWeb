var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sitemap = require('express-sitemap');

//var fourOhFour = require('./AppServer/views/404.jade');

require('./AppAPI/models/db');

var indexRouter = require('./AppServer/routes/index');
var apiRouter = require('./AppAPI/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'AppServer', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api', apiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.render('404.jade', {});
  //next(createError(404));
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


// Sitemap
sitemap.generate(app).XMLtoFile('sitemap.xml');

app.post('/sitemap', function(req, res){
    res.contentType('application/xml');
    res.sendFile(path.join(__dirname , 'sitemap.xml'));
});

// Robots.txt
app.post('/robots.txt', function(req, res){
    //res.contentType('application/xml');
    res.sendFile(path.join(__dirname , 'robots.txt'));
});


/*app.post('/sr', function(req, res) {
	res.redirect("http://192.168.1.87:3000/search/" + encodeURIComponent(req.body.search));
});

app.listen(3000, function() {
	console.log("Search Server Running on Port 3000")
})*/


module.exports = app;
