console.log("start");
var id;
var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var address;
var lat;
var lon;
var location_names=[];
var open_now=[];
var ratings=[];
var placeIDs=[];
var addresses=[];

// Show splash screen while waiting for data
var splashWindow = new UI.Window();

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 0, 
  timeout: 5000
};

var text = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    text:"Waiting for location...",
    font:'GOTHIC_28_BOLD',
    color:'black',
    textOverflow:'wrap',
    textAlign:'center',
  	backgroundColor:'white'
});
splashWindow.add(text);
splashWindow.show();

splashWindow.on('click', 'select', function(event) {
    console.log("select button");
    id = navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);    
});

splashWindow.on('click', 'up', function(event) {
    console.log("up");
  ajax(
  {
    url:'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+","+lon+'&radius=500&types=food&key=AIzaSyBb4_xUiYMw5swIGMZghCRdJYnZazdIhK4',
    type:'json'
  },
  function(data) {
    // Create an array of Menu items
    for(var x=0;x<data.results.length;x++){
      location_names[x]=data.results[x].name;
      if(data.results[x].hasOwnProperty('opening_hours.open_now')){
        open_now[x]=data.results[x].opening_hours.open_now;
      }
      else{
        open_now[x]="no data";
      }
      if(data.results[x].hasOwnProperty('rating')){
        ratings[x]=data.results[x].rating;
      }
      else{
        ratings[x]="no data";
      }
      placeIDs[x]=data.results[x].place_id;
      addresses[x]=data.results[x].vicinity;

      console.log(location_names[x]);
      console.log(open_now[x]);
      console.log(ratings[x]);      
      console.log(placeIDs[x]);      
      console.log(addresses[x]);      

    }
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
  );
});
    

function locationSuccess(pos) {
  lat=pos.coords.latitude;
  lon=pos.coords.longitude;
  console.log("search success");
  ajax(
  {
    url:'https://maps.googleapis.com/maps/api/geocode/json?latlng='+pos.coords.latitude+","+pos.coords.longitude+'&key=AIzaSyBb4_xUiYMw5swIGMZghCRdJYnZazdIhK4',
    type:'json'
  },
  function(data) {
    // Create an array of Menu items
    address= data.results[0].formatted_address;
    var text = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    text:address,
    font:'GOTHIC_28_BOLD',
    color:'black',
    textOverflow:'wrap',
    textAlign:'center',
  	backgroundColor:'white'
});
  splashWindow.add(text);
  splashWindow.show();
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);
  console.log('Location changed!');
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
}

function locationError(err) {
  text.text="failed to retrieve location";
  splashWindow.add(text);
  console.log("search fail");
  console.log('location error (' + err.code + '): ' + err.message);
}


