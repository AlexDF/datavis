var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var csv = require('csv');
var records = new Array();

app = express();

mongoose.connect('mongodb://localhost/directory');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  // code goes here
});


csv(records)
  .from.stream(fs.createReadStream('data' + '/directory.csv'), {
  columns: true
})
  .on('record', function(row, index) {
  records.push(row);

  //console.log(row);
});

app.get( '/', function(req, res) {
  res.send(records);
});

app.listen(3000);
