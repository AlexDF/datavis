var express = require('express');
var fs = require('fs');
var csv = require('csv');
var records = new Array();

app = express();

csv(records)
  .from.stream(fs.createReadStream('data' + '/directory.csv'), {
  columns: true
})
  .on('record', function(row, index) {
  records.push(row);

  console.log(row);
})

app.get( '/', function(req, res) {
  res.send("hello");
});

app.listen(3000);
