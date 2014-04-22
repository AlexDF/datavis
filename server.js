var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var csv = require('csv');
var records = new Array();
var output = "";
var bodyParser = require('body-parser');

app = express();
app.use(bodyParser());

csv(records)
  .from.stream(fs.createReadStream('data' + '/directory.csv'), {
  columns: true
})
  .on('record', function(row, index) {
  records.push(row);

  //console.log(row);
});

// This large chunk of commented code saved all the csv
// records into mongodb as part of it's first-time execution.
// Now that we have our records, it is not needed anymore, 
// but I'll leave it here for now.

/*mongoose.connect('mongodb://localhost/directory');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  // defining schema
  var schoolSchema = mongoose.Schema({
      countyName: String,
      schoolName: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      phone: String
    });

  // defining model
  var School = mongoose.model('School', schoolSchema);
  var item;  

  for(var i = 0; i < records.length; i++) {
    item = new School( {
      countyName: records[i][' County Name'],
      schoolName: records[i][' School Name'],
      address: records[i][' Address'],
      city: records[i][' City'],
      state: records[i][' State'],
      zip: records[i][' Zip'],
      phone: records[i][' Phone']
    });

    item.save(function (err, item) {
      if (err) return console.error(err);
    });
  }
});*/


app.get( '/', function(req, res) {
  res.render('index.ejs', {result: ''});
});

app.post('/findschool', function(req, res) {
  mongoose.connect('mongodb://localhost/directory/');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback() {
   /* var schoolSchema = mongoose.Schema({
      countyName: String,
      schoolName: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      phone: String
    });*/


    //var schools = mongoose.model('schools', schoolSchema);
 
    var match = db.schools.find( {schoolName: req.body.school_name} );

    res.render('index.ejs', {result: match.length});
  });
  //res.render('index.ejs', {result: match});
});

app.listen(3000);





