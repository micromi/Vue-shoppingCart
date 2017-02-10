var express = require('express');
var path = require('path');
var app = express();

//app.get('/', function (req, res) {
//res.send('Hello World!');
//});

app.use(express.static(path.join(__dirname, './')));

var server = app.listen(3000, function () {
  
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});