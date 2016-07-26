var pg = require('pg');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/images'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/', function(request, response) {
	if(request.query.score !== undefined){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query("INSERT INTO fakescores values(5, $1, 4, $2)", [request.query.name, request.query.score]);
		});
		response.render('redirect');}
	else{
		response.render('index');
	}
});

app.get('/leaderboard', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM fakescores ORDER BY score DESC', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('db', {results: result.rows} ); }
    });
  });
})

app.post('/LEDon', function(req, res) {
	console.log(req.query.name);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query("INSERT INTO fakescores values(5, $1, 4, $2)", [req.query.name, req.query.score]);
		});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


