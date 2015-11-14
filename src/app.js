console.log("start");
var id;
var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var address;
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
  console.log("test");
        id = navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);


    
});

function locationSuccess(pos) {
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


