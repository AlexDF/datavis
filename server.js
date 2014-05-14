var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var csv = require('csv');
var records = new Array();
var output = "";
var bodyParser = require('body-parser');
var ratingStats = [0,0,0,0,0,0,0,0,0,0];



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
      grade: String,
      rating: String
    });


var School = mongoose.model('School', schoolSchema);

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

//mongoose.connect('mongodb://localhost/directory');
//var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  // defining schema
  /*var schoolSchema = mongoose.Schema({
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
  var School = mongoose.model('School', schoolSchema);*/
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

  console.log("Data Load Completed!");
});


/*app.get( '/', function(req, res) {
  res.render('index.ejs', {name: '', address: '', city: '', state: ''});
});*/





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





app.get('/', function(req, res) {
    School.find(function(err, school) {
      if(err) {console.log('Error: ' + err);}
      else{
        for(var i = 0; i < school.length; i++) {
          switch( school[i].rating ) {
            case "1":
              ratingStats[0] += 1;
              break;
            case "2":
              ratingStats[1] += 1;
              break;
            case "3":
              ratingStats[2] += 1;
              break;
            case "4":
              ratingStats[3] += 1;
              break;
            case "5":
              ratingStats[4] += 1;
              break;
            case "6":
              ratingStats[5] += 1;
              break;
            case "7":
              ratingStats[6] += 1;
              break;
            case "8":
              ratingStats[7] += 1;
              break;
            case "9":
              ratingStats[8] += 1;
              break;
            case "10":
              ratingStats[9] += 1;
              break;
          } // end switch
        } // end for
        
        res.render('index.ejs', {ratings: ratingStats});
        ratingStats = [0,0,0,0,0,0,0,0,0,0];
      } // end if/else
    });
    
    //ratingStats.push(1);
  //} // end for loop
  //console.log(ratingStats[0]);
  //res.render('index.ejs', {ratings: ratingStats});
    

  //ratingStats = [];
}); // end app.get('/getstats')




app.get("/js/lib/jquery-1.11.0.min.js", function (req, res) {
    res.sendfile(__dirname + "/js/lib/jquery-1.11.0.min.js");
});
app.get("/css/nv.d3.css", function (req, res) {
    res.sendfile(__dirname + "/css/nv.d3.css");
});
app.get("/js/lib/d3.min.js", function (req, res) {
    res.sendfile(__dirname + "/js/lib/d3.min.js");
});
app.get("/js/lib/nv.d3.min.js", function (req, res) {
    res.sendfile(__dirname + "/js/lib/nv.d3.min.js");
});
app.get("/css/style.css", function (req, res) {
    res.sendfile(__dirname + "/css/style.css");
});


app.listen(3000);








