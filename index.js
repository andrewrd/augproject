var express = require('express');
var app = express();
app.use(express.static(__dirname + '/static'));

app.get('/getmodels', function (req, res) {
  res.send('Hello World!');
});

app.get('/',function(req,res){
  res.sendFile('static/index.html');
    res.sendFile('')
  //__dirname : It will resolve to your project folder.
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});




var request = require('hyperquest');

var req = request('http://3d.ltc.mq.edu.au/3d/model/MU_3069/MU_3069_final_10k.obj');
req.pipe(process.stdout);
