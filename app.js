const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

app.use(express.static('public'));


const {MongoClient} = require('mongodb');

// Passport Config


// Connect to Mongo
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes


app.use('/', require('./routes/index.js'));


app.use('/users', require('./routes/users.js'));
//app.use('/map', require('./routes/users.js'));

const PORT = process.env.PORT || 8080;

//app.listen(PORT, console.log(`Server started on port ${PORT}`));
let server = app.listen(PORT, function () {
  console.log("En écoute sur http://127.0.0.1:"+PORT);
});
require('./config/passport')(passport);

// DB Config
const db = require('./config/keysUser').mongoURI;
const Marker = require('./models/marker');

function makeID(){
  return Math.random() *10000*(Math.random() *10000*(Math.random() *10000*(Math.random() *10000)))
}
const io = require('socket.io').listen(server).sockets;
io.on('connection', function(socket){

  socket.on('removeTap', function(d){
    console.log(d)
    Marker.deleteOne({ _id: d[0]}, function (err) { if(err) console.log(err)});
    setTimeout(function(){tapUpdater()}, 1000)
  })
  socket.on('getTaps', function(d){

      console.log(d)
      console.log(d[1] +" "+d[0] +' '+d[3]+" "+ d[2])

      const OverpassFrontend = require('overpass-frontend')

      // you may specify an OSM file as url, e.g. 'test/data.osm.bz2'
        const overpassFrontend = new OverpassFrontend('//overpass-api.de/api/interpreter')
        var res23 = [
            {
                ttt: 0
             }
          ]
          var isEverythingFine = false
        // request restaurants in the specified bounding box
        overpassFrontend.BBoxQuery(
          'nwr[amenity=drinking_water]',
          { minlat: d[1], maxlat: d[0], minlon: d[3], maxlon: d[2] },
          {
            properties: OverpassFrontend.ALL
          },
          function (err, result) {

            var dataToSend = {
                _id : result.id,
                lat: result.geometry.lat,
                lng: result.geometry.lon,

                undeletable: true
            }
            res23.push({dataToSend})

            //console.log(dataToSend)
            isEverythingFine = true
          
          },

          function (err) {
            if (err) { console.log(err) }
          },


        )
        function re(){
          setTimeout(function(){
              if(isEverythingFine){
                  socket.emit('nearMarkers', res23)

              }else re()
          }, 500)
      }
      re()


  })
  socket.on('recommandTap', function(d){
      MongoClient.connect('mongodb://admin:Y2iynSuvZtk7IWx4@cluster0-p4eef.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }).then(client => {
          const db = client.db('test')
  
      db.collection("markers").find({id: d[0]}).toArray(function(err, result) {
          //console.log(result)
          r = result
  
      })
      setTimeout(function(){

          if(r[0].fiabilityVoters.includes(d[1]) ){
              return socket.emit('notAllowedToVoteAgain')
          }else {
      db.collection("markers").updateOne({_id: d[0]}, {$set:{fiability: parseFloat(r[0].fiability)+1, fiabilityVoters: d[1] +" "+(r[0].fiabilityVoters)}})
          }
      }, 3000)
      tapUpdater()
      
  })
  socket.on('modifyValue', function(d){
      console.log('d')

      console.log(d)
      console.log(d[0])
      console.log(d[1])


      console.log('modifiying')

      var markersOne =" "
      //setTimeout(function(){
        Marker.find({id: d[0]}, function(err, res){
          console.log(res)
          markersOne = res
  
        })
        console.log(markersOne.voteDeleters)
          /*console.log(r.id)
          console.log(r)
          console.log(r[0])

          console.log('r')*/
      if(markersOne.voteDeleters.includes(d[1])){
          return socket.emit('notAllowedToVoteAgain')
      }else {

      Marker.update({_id: idd}, {
          deleteVotes: parseFloat(r[0].deleteVotes)+1
        }, function(err, affected, resp) {
         console.log(resp);
        })
      //db.collection("markers").updateOne({id: d[0]}, {$set:{deleteVotes: parseFloat(r[0].deleteVotes)+1, voteDeleters: d[1] +" "+(r[0].voteDeleters)}});
      if (r[0].deleteVotes ==11 && r[0].fiability < 10){
          Marker.deleteOne({ _id: d[0]}, function (err) { if(err) console.log(err)});
      }
      else if (r[0].deleteVotes ==21 && r[0].fiability < 25){
        Marker.deleteOne({ _id: d[0]}, function (err) { if(err) console.log(err)});

      }
      else if (r[0].deleteVotes ==31 && r[0].fiability < 35){
        Marker.deleteOne({ _id: d[0]}, function (err) { if(err) console.log(err)});

      }
      else if (r[0].deleteVotes ==53 && r[0].fiability < 50){
        Marker.deleteOne({ _id: d[0]}, function (err) { if(err) console.log(err)});

      }
      else if (r[0].deleteVotes ==73 && r[0].fiability < 70){
        Marker.deleteOne({ _id: d[0]}, function (err) { if(err) console.log(err)});
      }    
      }
      tapUpdater()
      client.close();
      //}, 3000)
      }, e => console.log('Error to connect', e))   


  })
  socket.on('insertMany', function(d){
    console.log(d)

    const newMarker = new Marker({
      "lat": parseFloat(d[0]),
      "lng": parseFloat(d[1]),
      "creatorName":d[2],
      "taste": d[3],
      "free": d[4],
      "fiabilityVoters":d[2],

    })
    newMarker
      .save()
      .then(markers =>{ 
        console.log("inserted")
        tapUpdater()})
    
      

  })
  socket.on('update', function(){
      tapUpdater()
  })
  socket.on('findMarkers', function(){

    Marker.find({}, function(err, res){
      console.log(res)
      socket.emit('markersArray', res)

    })
})

  function tapUpdater(){
      Marker.find({}, function(err, res){
        console.log(res)
        socket.emit('tapUpdater', res)

      })
  }
})

