var express = require('express');
var app = express();
app.use(express.static(__dirname + '/static'));

app.get('/getmodels', function (req, res) {
  res.send('Hello World!');
});

app.get('/',function(req,res){
  res.sendFile('static/index.html');
  //__dirname : It will resolve to your project folder.
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});