var express = require('express');
var app = express();
var request = require('hyperquest');

app.use(express.static(__dirname + '/static'));

app.get('/getmodels/:name', function (req, res) {
	var name = req.params;
	var rname = request('http://3d.ltc.mq.edu.au/3d/model/181/WWII_AK772_TOY_PLANE_10k.obj');
	//Returns json response with name
	res.send(name);
});

app.get('/',function(req,res){
  res.sendFile('static/index.html');
    res.sendFile('')
  //__dirname : It will resolve to your project folder.
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


