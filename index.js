var express = require('express');
var app = express();
var request = require('hyperquest');
var wait = require('event-stream').wait;

app.use(express.static(__dirname + '/static'));

app.get('/getmodels', function (req, res) {
	var name = req.params;
	var answer = request.get('http://3d.ltc.mq.edu.au/3d/model/181/WWII_AK772_TOY_PLANE_full2.obj');
	//Returns json response with name
	var obj;

	answer.pipe(wait(function(err, data){
	    obj = data;
	    res.send(obj);
	  }));
});

app.get('/',function(req,res){
  res.sendFile('static/index.html');
    res.sendFile('')
  //__dirname : It will resolve to your project folder.
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


