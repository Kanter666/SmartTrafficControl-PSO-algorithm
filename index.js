var pg = require('pg');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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

app.get('/test', function(request, response) {
	response.render('testing');
});

app.get('/test1', function(request, response) {
	response.render('testing1');
});

app.post('/', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		client.query("INSERT INTO results values($1, $2, $3, $4, $5, $6, $7)", [request.body.game, request.body.M, request.body.name, request.body.score, request.body.round, request.body.jams, request.body.cars]);
		done();
	});
});

app.get('/leaderboard', function (request, response) {
	if(request.query.m === undefined){
	  pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT ROW_NUMBER() OVER (ORDER BY score DESC) AS number, * FROM results ORDER BY score DESC', function(err, result) {
		  done();
		  if (err)
		   { console.error(err); response.send("Error " + err); }
		  else
		   { response.render('db', {results: result.rows} ); }
		});
	  });
	 }else{
		pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT ROW_NUMBER() OVER (ORDER BY score DESC) AS number, * FROM results WHERE m = $1 ORDER BY score DESC', [request.query.m], function(err, result) {
		  done();
		  if (err)
		   { console.error(err); response.send("Error " + err); }
		  else
		   { response.render('db', {results: result.rows} ); }
		});
	  });
	 }
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


