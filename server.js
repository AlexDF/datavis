var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var csv = require('csv');
var records = new Array();
var output = "";
var bodyParser = require('body-parser');
var ratingStats = new Array();

app = express();
app.use(bodyParser());

mongoose.connect('mongodb://localhost/directory/');
var db = mongoose.connection;

var schoolSchema = mongoose.Schema({
      countyName: String,
      schoolName: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
      grade: String
    });


var School = mongoose.model('School', schoolSchema);

/*csv(records)
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

mongoose.connect('mongodb://localhost/directory');
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
      phone: String,
      rating: String
    });

  // defining model
  var School = mongoose.model('School', schoolSchema);
  var item;  

  for(var i = 0; i < records.length; i++) {
    item = new School( {
      countyName: records[i][' County Name'],
      schoolName: records[i][' School Name'].toUpperCase(),
      address: records[i][' Address'],
      city: records[i][' City'],
      state: records[i][' State'],
      zip: records[i][' Zip'],
      phone: records[i][' Phone'],
      rating: records[i]['Rating']
    });

    item.save(function (err, item) {
      if (err) return console.error(err);
    });
  }

  console.log("Completed!");
});*/


app.get( '/', function(req, res) {
  res.render('index.ejs', {name: '', address: '', city: '', state: ''});
});

app.post('/findschool', function(req, res) {
    School.find({ schoolName: req.body.school_name }, function(err, school) {
      if(err) {console.log('Error: ' + err);}
      else {
        var match = school[0];
        res.render('index.ejs', {name: match.schoolName, address: match.address, 
          city: match.city+',', state: match.state});
      }
    }); // end School.find()
}); // end app.post('/findschool',)

app.get('/getstats', function(req, res) {
  for (var i = 1; i <= 10; i++) {
    School.find({ rating: i.toString() }, function(err, school) {
      if(err) {console.log('Error: ' + err);}
      else {
        ratingStats.push(school.length);
        //console.log(school);
      }
    }); // end School.find
  } // end for loop
  
  res.render('index.ejs', {ratings: ratingStats});
}); // end app.get('/getstats')

app.listen(3000);








