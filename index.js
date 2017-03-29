var pg = require('pg');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var connectionString = "postgres://xqexpnucxslaxx:fe267bb2462aba52bac8977a8b88dcb5bf538dff2644a15812399b5146f26d21@ec2-54-247-166-129.eu-west-1.compute.amazonaws.com:5432/dbgdvh0db5d2c7";

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/images'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('index');
});

app.post('/', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		client.query("INSERT INTO results values(random_text(10), $1, $2, $3, $4, $5, $6)", [request.body.M, request.body.name, request.body.score, request.body.round, request.body.jams, request.body.cars]);
		done();
		client.query('SELECT gameid FROM results WHERE name=$1 AND score=$2', [request.body.name, request.body.score], function(err, result) {
		  done();
		  if (err)
		   { console.error(err); response.send("Error " + err); }
		  else
		   { response.json(result.rows); }
		});
	});
});

/*app.get('/AMTPayList', function(request, response) {
	if(request.query.id !== undefined){
		//if(request.query.id.substr(0,3) === "AI53"){
			pg.connect(connectionString, function(err, client, done) {
				client.query('SELECT gameid FROM results', function(err, result) {
				  done();
				  if (err)
				   { console.error(err); response.send("Error " + err); }
				  else
				   { response.json(result.rows); }
				});
			});
		//}
	}else{
		response.json([]);
	}
});*/

app.get('/jams', function(request, response) {
	if(request.query.id !== undefined){
			pg.connect(connectionString, function(err, client, done) {
				client.query('SELECT jams FROM results WHERE gameid=$1', [request.query.id],function(err, result) {
				  done();
				  if (err)
				   { console.error(err); response.send("Error " + err); }
				  else
				   { response.json(JSON.parse("[" + result.rows[0].jams + "]")); }
				});
			});
	}else{
		response.json([]);
	}
});

app.get('/cars', function(request, response) {
	if(request.query.id !== undefined){
			pg.connect(connectionString, function(err, client, done) {
				client.query('SELECT cars FROM results WHERE gameid=$1', [request.query.id],function(err, result) {
				  done();
				  if (err)
				   { console.error(err); response.send("Error " + err); }
				  else
				   { response.json(JSON.parse("[" + result.rows[0].cars + "]")); }
				});
			});
	}else{
		response.json([]);
	}
});

app.get('/simulator-data', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT jams, cars FROM results WHERE gameid=$1', [request.query.id], function(err, result) {
		  done();
		  if (err)
		   { console.error(err); response.send("Error " + err); }
		  else
		   { response.json(result.rows); }
		});
	});
});

app.get('/simulator', function(request, response) {
	response.render('simulator');
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


