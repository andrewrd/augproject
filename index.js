var express = require('express');
var app = express();
var request = require('hyperquest');

app.use(express.static(__dirname + '/static'));

app.get('/getmodels', function (req, res) {
	request('http://3d.ltc.mq.edu.au/3d/model/181/WWII_AK772_TOY_PLANE_10k.obj').pipe(process.stdout);
});

app.get('/',function(req,res){
  res.sendFile('static/index.html');
    res.sendFile('')
  //__dirname : It will resolve to your project folder.
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


