var pg = require('pg');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var connectionString = "postgres://hahwdizbogbvgc:-XXSpyHFDYnILxx_hsK0niwWK8@ec2-50-19-240-113.compute-1.amazonaws.com:5432/dcn9llujgn2dio";

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/images'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('index');
});

app.post('/', upload.array(), function(request, response) {
	var data = {name: request.body.name, score: request.body.score};
	pg.connect(connectionString, function(err, client, done) {
		client.query("INSERT INTO fakescores values(5, $1, 4, $2)", [data.name, data.score]);
	});
});

app.post('/cars', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		client.query("INSERT INTO fakescores values(5, $1, 4, $2)", [request.query.name, request.query.score]);
	});
});

app.post('/jams', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		client.query("INSERT INTO fakescores values(5, $1, 4, $2)", [request.query.name, request.query.score]);
	});
});

app.get('/leaderboard', function (request, response) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT * FROM fakescores ORDER BY score DESC', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('db', {results: result.rows} ); }
    });
  });
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


