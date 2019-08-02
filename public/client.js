
Markers = [
]
var taste = undefined
var isFree = undefined
var temperature = undefined
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
//Markers.push({name : "Redsqf Fort", lat : 555 , lng : 666})
const socket = io() 
var markerPos = {
  lat: 0,
  lng: 0
}
function markerUpdater(){

for(var i = 0; i < Markers.length; i++) {
  //var title = Markers[i].title,
  console.log(Markers)

  console.log(Markers[i])
  
  var item = Markers[i]

  console.log(item)
  
  id = item._id
  var undeletable = item.undeletable
  lat = item.lat
  lng = item.lng
  var pos = {lat, lng}   
  //kriteria = Markers[i].data.kriteria,     
  //iconUrl =  Markers[i].icon.url,
  var iconUrl = ""
  if(item.undeletable){
    iconUrl = "images/marker-icon.png"
  }else{

  
  if(item.fiability < 3){
    iconUrl = "images/marker-red.png"
  }else if(item.fiability < 10){
    iconUrl = "images/marker-orange.png"
  }else if(item.fiability < 20){
    iconUrl = "images/marker-yellow.png"
  }else iconUrl = "images/marker-green.png"
}

  var marker = new L.Marker(new L.latLng(pos), 
  {
    icon: L.icon({
      iconUrl: iconUrl,
      shadowUrl:  "images/marker-shadow.png",
      iconAnchor: [12.5,38],
      popupAnchor: [0,-30]

    }),
    title: "title",
    creatorName: item.creatorName,
    id: id,
    undeletable :undeletable
  }
  
  ).addTo(macarte);
  var distanceZ = distance(lat, lng, coordinate.lat, coordinate.lng, "K").toFixed(2)
  var popupTxt = '<p id="distA">You are '+ distanceZ + " KM away from this tap</p>"
  if(item.undeletable == false){
    popupTxt = popupTxt + "Fiability:" +item.fiability+"/100"
    if(item.taste !== null){
      popupTxt = popupTxt+"<br>Taste: "+item.taste+" /5"
    }else popupTxt = popupTxt+"<br> Its taste is not defined"

    if(item.free == true){
      popupTxt = popupTxt+"<br>It's free !"
    }else popupTxt = popupTxt+"<br>It's not free :("

  }else popupTxt = popupTxt+"<br>This tap is fully certified by OSM."
  var dist = null
  marker.on('preclick', function(e) {
    /*console.log(e.latlng)
    console.log(e)
    console.log(e.target._popup._content)*/
    dist = distance(e.latlng.lat, e.latlng.lng, coordinate.lat, coordinate.lng, "K").toFixed(2)
    if(e.sourceTarget.options.undeletable == false){
   
 
    if(dist <300 && !(e.target._popup._content.includes("Delete this marker"))){
      console.log("canDel")
      console.log(marker)
      console.log(e.sourceTarget.options.creatorName+" "+ document.getElementById("username").innerHTML)
      if(e.sourceTarget.options.creatorName == document.getElementById("username").innerHTML){
        e.target._popup._content = e.target._popup._content +" <p id=\"canDelete\">Delete this marker ("+ item.deleteVotes+" already voted)</p>"
      }else if(document.getElementById("username").innerHTML !== 0) e.target._popup._content = e.target._popup._content +" <p id=\"canVoteDelete\">Vote Delete this marker ("+ item.deleteVotes+" already voted)</p>"
    }else {console.log(dist)
    console.log(e.target._popup._content)}
      console.log(e.target._popup._content)
   
    if(dist <300 && !(e.target._popup._content.includes("Recommand this marker"))){
      console.log("canDel")
      console.log(marker)
      console.log(e.sourceTarget.options.creatorName+" "+ document.getElementById("username").innerHTML)
        
      if(document.getElementById("username").innerHTML !== 0 && e.sourceTarget.options.creatorName !== document.getElementById("username").innerHTML) {
        e.target._popup._content = e.target._popup._content +" <br><p id=\"canRecommand\">Recommand this marker </p>"
      }
    }
      console.log(e.target._popup._content)
    }
    //$('#ModalDetail').modal('show').on('shown.bs.modal', function(e) {
    //});
  });
  marker.bindPopup(popupTxt).on('click', function(e){
    console.log(e.target.options.id)
    if(document.getElementById('canDelete') !== null && document.getElementById('canDelete') !== undefined){
      document.getElementById('canDelete').addEventListener("click", function(){
        socket.emit('removeTap', [e.target.options.id, document.getElementById("username").innerHTML])
        window.location.reload()

      })
    }else if(document.getElementById('canVoteDelete') !== null && document.getElementById('canVoteDelete') !== undefined){
      document.getElementById('canVoteDelete').addEventListener("click", function(){
        console.log('kek')
        socket.emit('modifyValue', [e.target.options.id,document.getElementById("username").innerHTML])
        window.location.reload()

      })

    }
    if(document.getElementById('canRecommand') !== null && document.getElementById('canDelete') !== undefined){
      document.getElementById('canRecommand').addEventListener("click", function(){
        socket.emit('recommandTap', [e.target.options.id, document.getElementById("username").innerHTML])
        window.location.reload()

      })
    }
 
    console.log(e)
    console.log(dist)
    document.getElementById("distA").innerHTML = ('<p> You are '+ dist + " KM away from this tap</p>")
    console.log(document.getElementById("dist"))
  })


  macarte.addLayer(marker);
}
};

socket.on('tapUpdater',  function(d){
  if(Markers.length == 0){
    Markers = d
  }else{
    var Markers2 = Markers.filter(element => element.undeletable === true)
    
    Markers = Markers2
    for(var i = 0; i < d.length; i++) {
      if(d[i] !== undefined){
        Markers.push(d[i])


      }

    }
  }
  console.log(Markers)

  markerUpdater()
})
function isAnyMarkerNearby(d){
  console.log(d)
  console.log(d.lat)
  markerPos.lat = parseFloat(d.lat)
  markerPos.lng = parseFloat(d.lng)

  console.log(markerPos)
  socket.emit('findMarkers')

}
socket.on('markersArray', function(d){
  console.log(markerPos)
  console.log("isarreayd")
  console.log(d)
  var isNearby = false
  for(var i = 0; i < d.length && isNearby == false; i++) {
    console.log(d)
    console.log(d[i])

    console.log('XEDXD')
    pos = d[i]

    lat = parseFloat(pos.lat)
    lng = parseFloat(pos.lng)    
/*
    var diff= {
      lat: lat - parseFloat(markerPos.lat),
      lng: lng - parseFloat(markerPos.lng)
          if(diff.lat.toFixed(5) == 0 && diff.lng.toFixed(5) == 0){
      isNearby = true
      console.log(d[i])
    }

    }*/
    var Dist = distance(lat, lng, markerPos.lat, markerPos.lng, "K")
    if(Dist < 0.005){
      isNearby = true
    }

  }
  console.log(isNearby)
  if(isNearby){

    document.getElementById('smthAlreadyHere').style.display = ""
    


    
    console.log('smth already here')

    //popup.setPosition(coordinate);
  }else{ 
    console.log('WHAT THE HECL')
    console.log(markerPos)
    
    //markerUpdater()
    socket.emit('insertMany', [markerPos.lat,markerPos.lng,document.getElementById("username").innerHTML,document.getElementById('myRangeCrt').value, document.getElementById('freeBox').checked ])
    console.log(document.getElementById("username").innerHTML)

  }
})

socket.on('nearMarkers', function(r){
  console.log('Hello')

  for(var i = 0; i < r.length; i++) {
    if(r[i].dataToSend !== undefined){
      Markers.push(r[i].dataToSend)

    }

  }
  /*for(var i = 0; i < r.length; i++) {

  }*/
  console.log(Markers)
  markerUpdater()
})


function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

function checkNearestMarker(fiability, taste, temperature){
  var bestDist = 900000
  var smallFiab = 0
  var goodMarker = 90000
  var bestFiab = fiability
  var bestTaste = taste
  taste = parseFloat(taste)
 fiability = parseFloat(fiability)

  console.log(fiability+" "+taste+" "+temperature)

  for(var i = 1; i < Markers.length; i++) {
    console.log(Markers[i])
    //var title = Markers[i].title,

    var item = Markers[i]

    console.log(item)

    var Dist = distance(coordinate.lat, coordinate.lng, item.lat, item.lng, "K")
    if(item.undeletable == false){

    
    if(item.fiability >= fiability){
          if(item.taste >= taste){
                if(bestDist > Dist){
                  bestDist = Dist
                  goodMarker = Markers[i]
                }else return console.log('dist not valid')  
        
          }else return console.log('taste inferior at what u asked')
          

          }else console.log('fiability not good')
      }else if(bestDist > Dist){ //the item is an osm certified marker.
        bestDist = Dist
        goodMarker = item
      }
  }
    // smallDist = distance(coordinate.lat, coordinate.lng, item.lat, item.lng, "K")

  

  if(goodMarker == 90000){
    return console.log("aint")

  } else{
    return goodMarker
  } 


}
/*function isAnyMarkerNearby2(){
  var isNearby = false
  for(var i = 1; i < Markers.length && isNearby == false; i++) {
    console.log(Markers[i])
    //var title = Markers[i].title,
    var s = Markers[i]
    var d3 = s.d
    var item = d3[0]

    console.log(item)

    var Dist = distance(coordinate.lat, coordinate.lng, item.lat, item.lng, "K")
    if(Dist > 0.005){
      isNearby = true
    }
  }
  if(isNearby){
    // a marker is less than 5 meters away
  }else
}*/
document.getElementById('search').addEventListener('click', function(){
  console.log('SDDD')
  document.getElementById('search2').style.display = ""
  document.getElementById('create').style.display = "none"

})
document.getElementById('searchBtn').addEventListener('click', function(){
  var nrstMrk = checkNearestMarker(slider1.value, slider2.value)
  document.getElementById('create').style.display = "none"
  document.getElementById('search2').style.display = "none"
  if(nrstMrk == null){
    document.getElementById('nrstMrkNotFound')
  }else macarte.flyTo([nrstMrk.lat, nrstMrk.lng], 20)


})
document.getElementById('map').addEventListener('click', function(){
  console.log('Hello')
  document.getElementById('search2').style.display = "none"
  document.getElementById('create').style.display = "none"

})
document.getElementById('reCenterIt').addEventListener('click', function(){
  document.getElementById('search2').style.display = "none"
  document.getElementById('create').style.display = "none"
  //macarte = L.map('map').setView([coordinate.lat, coordinate.lng], 16);
  macarte.flyTo([coordinate.lat, coordinate.lng], 16)
   //macarte.setZoom(16);

})
document.getElementById('createMarker').addEventListener('click', function(){
  document.getElementById('create').style.display = ""
  document.getElementById('search2').style.display = "none"

  //taste = 
  //isFree  =
  //temperature =
  //isAnyMarkerNearby2(coordinate)

})
document.getElementById('createBtn').addEventListener('click', function(){
  isAnyMarkerNearby(coordinate)
  document.getElementById('create').style.display = "none"

})
document.getElementById('freeBox').addEventListener( 'change', function() {
  if(this.checked) {
    isFree = true

  } else {
    isFree = false

      // Checkbox is not checked..
  }
});


//console.log(Markers)


var userlat = 0
var userlon = 0
var posIsDefined= false
var macarte = null;
var coordinate = {
  lat: 0,
  lng: 0
}
  getLocation()
  setTimeout(function(){initMap()},3000)
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
    console.log( "Geolocation is not supported by this browser.")
  }
}

var markersLayer = L.layerGroup([])
var marker = 0
window.addEventListener("deviceorientation", handleOrientation, true);
var alpha  = 0

function handleOrientation(event) {

alpha = event.alpha
  // Faites quelque chose avec les données acquises. ;)
}
function showPosition(position) {
  coordinate.lat = position.coords.latitude
  coordinate.lng = position.coords.longitude
  if(marker !== 0){
    macarte.removeLayer(marker);
    console.log("changed")
    marker= new L.Marker(new L.latLng(coordinate), {
    icon: L.icon({
      
      iconUrl: "images/urself.png",
      iconSize: [60,70],
      rotationAngle: alpha,

      iconAnchor: [60/2,70/2],
      popupAnchor:[-6 ,-10]
    }),
    title: "title"
  }).addTo(macarte);
    //marker.bindPopup("You Are Here :)");

  }
  console.log( "Latitude: " + position.coords.latitude +" Long: " + position.coords.longitude)
}

var slider1 = document.getElementById("myRange");
var output1 = document.getElementById("fiabilityAmount");
output1.innerHTML = slider1.value; 
slider1.oninput = function() {
  output1.innerHTML = this.value;
}
var slider5 = document.getElementById("myRangeCrt");
var output5 = document.getElementById("tasteAmountCrt");
output5.innerHTML = slider5.value; 
slider5.oninput = function() {
  output5.innerHTML = this.value;
  taste = this.value
}
var slider2 = document.getElementById("myRange2");
var output2 = document.getElementById("tasteAmount");
output2.innerHTML = slider2.value; 
slider2.oninput = function() {
  output2.innerHTML = this.value;
}
/*
var slider3 = document.getElementById("myRange3");
var output3 = document.getElementById("temperatureAmount");
output3.innerHTML = slider3.value; 
if(slider3.value==0){
  output3.innerHTML = 'i dont care'
};
slider3.oninput = function() {
  if(this.value==0){
    output3.innerHTML = 'i dont care'
  };
  if(this.value==1){
    output3.innerHTML = 'cold'
  };
  if(this.value==2){
    output3.innerHTML = 'normal'
  };
  if(this.value==3){
    output3.innerHTML = 'hot'
  };
}
*/
function initMap() {
  document.getElementById('loader').classList.remove('on')

 document.getElementById('loader').classList.add('off')

 setTimeout(function(){
  document.getElementById('loader').classList.remove('off')

    document.getElementById('loader').classList.add('offLoader')
}, 1100)
 document.getElementById('bckgrdLoader').classList.remove('onbckgrdLoader')

 document.getElementById('bckgrdLoader').classList.add('offbckgrdLoader')
 setTimeout(function(){ document.getElementById('bckgrdLoader').classList.add('offDbckgrdLoader')
}, 1100)

document.getElementById('loaderTxtD').classList.remove('loaderTxt')

document.getElementById('loaderTxtD').classList.add('loaderTxtOpOff')
setTimeout(function(){ 
  document.getElementById('loaderTxtD').classList.add('loaderTxtOff')
}, 1100)
  socket.emit('update')
  
  console.log(coordinate)
  macarte = L.map('map').setView([coordinate.lat, coordinate.lng], 16);
  //ownPosMarker = L.marker([coordinate.lat, coordinate.lng]).addTo(macarte);
  marker = new L.Marker(new L.latLng(coordinate), 
  {
    icon: L.icon({
      
      iconUrl: "images/urself.png",
      iconSize: [60,70],

      iconAnchor: [60/2,70/2],
      popupAnchor:[-6 ,-10]
    }),
    title: "title"
  }
  
  ).addTo(macarte);
  socket.emit('getTaps', [coordinate.lat +0.1, coordinate.lat -0.1,coordinate.lng +0.1,coordinate.lng-0.1])
  console.log('XD')
  //marker.bindPopup("You Are Here :)");


          // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
          L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
              // Il est toujours bien de laisselier le n vers la source des données
              attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
              minZoom: 1,
              maxZoom: 25
          }).addTo(macarte);

     
         // markerUpdater()
      
      
  
}
window.onload = function(){

  // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé

      }
