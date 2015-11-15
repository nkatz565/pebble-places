var UI = require('ui');
var Vector2 = require('vector2');
var id;
var ajax = require('ajax');
var address;
var lat;
var lon;
var location_names=[];
var open_now=[];
var ratings=[];
var placeIDs=[];
var addresses=[];
var holder;
var directions=[];
var endLats=[];
var endLons=[];
var dists=[];
var addressText;

var main = new UI.Card({
  title: 'PEBBLE PLACES',
  body: 'Waiting for location data'
});

var search_queries = [
  'food|bakery|bar|cafe|grocery_or_supermarket|meal_delivery|meal_takeaway|restaurant',
  'amusement_park|aquarium|art_gallery|bowling_alley|casino|movie_rental|movie_theater|museum|night_club|park|spa|stadium|zoo',
  'book_store|clothing_store|department_store|electronics_store|furniture_store|hardware_store|home_goods_store|jewelry_store|liquor_store|shoe_store|shopping_mall',
  'airport|bus_station|car_rental|subway_station|taxi_stand|train_station',
  'aquarium|book_store|library|museum|school|university|zoo',
  'beauty_salon|dentist|doctor|hair_care|hospital|pharmacy|physiotherapist|spa|veterinary_care'
  ];

var categories = {
  
  items: [{
        icon: 'images/food.png',
        title: 'Food'
      }, 
      {
        icon: 'images/entertainment.png',
        title: 'Entertainment'
      },
      {
        icon: 'images/shopping.png',
        title: 'Shopping'
      },
      {
        icon: 'images/transportation.png',
        title: 'Transportation'
      },
      {
        icon: 'images/education.png',
        title: 'Education'
      },
      {
        icon: 'images/health.png',
        title: 'Health'
      }]
  
};

var menu = new UI.Menu({
  sections: [categories]
});

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 0, 
  timeout: 5000
};

var places_menu = new UI.Menu();

main.show();
id = navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);    

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
    
    menu.show();
    main.hide();
    
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);
  console.log('Location changed!');
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
}

function locationError(err) {
  console.log("search fail");
  console.log('location error (' + err.code + '): ' + err.message);
}

Pebble.addEventListener('ready',function(e){
  console.log('AYYYYYYYYYYYYYYYYYYY');
});

var wait_screen = new UI.Card({body: 'Loading...'});

menu.on('select',function(e) {
  
  console.log('Ummmmmmmmm........');
  
  wait_screen.show();
  
  getLocalPlaces(e);
  
});


function displayMenu(menuItem) {
  
  if(menuItem.item.title == 'Food'){
    places_menu.section(0, {title: 'Nearby Food'});

  }

  else if(menuItem.item.title == 'Entertainment'){

    places_menu.section(0, {title: 'Nearby Entertainment'});
    
  }

  else if(menuItem.item.title == 'Shopping'){
    
    places_menu.section(0, {title: 'Nearby Shopping'});
    
  }

  else if(menuItem.item.title == 'Transportation'){
    
    places_menu.section(0, {title: 'Nearby Transportation'});
    
  }

  else if(menuItem.item.title == 'Education'){
    
    places_menu.section(0, {title: 'Nearby Education'});
    
  }

  else if(menuItem.item.title == 'Health'){
    
    places_menu.section(0, {title: 'Nearby Health'});
    
  }
  
  if(location_names.length === 0){
    
    places_menu.item(0,0, {title: 'Nothing Nearby',subtitle: ':('});
    
  }
  
  else {
    
    for(var i = 0; i < location_names.length; i++){
  
      if(i == 10){
  
        break;
  
      }
  
      places_menu.item(0,i, {title: location_names[i]});
        
    }
  
  }
  
  places_menu.show();
  
  wait_screen.hide();
  
}

function getLocalPlaces(menuItem){
  ajax(
  {
    url:'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+","+lon+'&radius=500&types='+search_queries[menuItem.itemIndex]+'&key=AIzaSyBb4_xUiYMw5swIGMZghCRdJYnZazdIhK4',
    type:'json'
  },
  function(data) {
    location_names=[];
    open_now=[];
    ratings=[];
    placeIDs=[];
    addresses=[];
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
    
    displayMenu(menuItem);
    
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
  );
}

places_menu.on('select',function(e) {
  
  var info_window = new UI.Window({
    clear:true
  });
  var rect = new UI.Rect({ size: new Vector2(144, 168) });
  var sep1 = new UI.Rect({ position: new Vector2(0, 64), size: new Vector2(144, 2),borderColor:"black",backgroundColor:"black" });
  var sep2 = new UI.Rect({ position: new Vector2(89, 0), size: new Vector2(2, 64),borderColor:"black",backgroundColor:"black" });

  info_window.add(rect);
  info_window.add(sep1);
  info_window.add(sep2);
  info_window.show();

   var display_info = location_names[e.itemIndex];
  
   if (addresses[e.itemIndex] != 'no data'){
    
    addressText=addresses[e.itemIndex];
     //display_info += '\n' + addresses[e.itemIndex];
    }
  else{
    addressText="No location data available";
  }
   var addressLayer= new UI.Text({ position: new Vector2(5, 70), size: new Vector2(125, 100) });
   info_window.add(addressLayer);
  if (ratings[e.itemIndex] != 'no data'){
    
    display_info += '\nRating: ' + ratings[e.itemIndex] + '/5';
    
  }
  
  //info_card.body(location_names[e.itemIndex] + '\n' + addresses[e.itemIndex] + '\nRating: ' + ratings[e.itemIndex] + '/5');
  
//   info_card.body(display_info);

  
//   info_card.show();
  
});

function getDrivingInstructions(){
   ajax(
  {
    url:'https://maps.googleapis.com/maps/api/directions/json?origin='+lat+','+lon+'&destination=place_id:'+placeIDs[0]+'&mode=walking&key=AIzaSyBb4_xUiYMw5swIGMZghCRdJYnZazdIhK4',
    type:'json'
  },
  function(data) {
    directions=[];
    endLats=[];
    endLons=[];
    dists=[];
    for(var x=0;x<data.routes[0].legs[0].steps.length;x++){
      holder=data.routes[0].legs[0].steps[x].html_instructions;
      endLats[x]=data.routes[0].legs[0].steps[x].end_location.lat;
      endLons[x]=data.routes[0].legs[0].steps[x].end_location.lng;
      dists[x]=data.routes[0].legs[0].steps[x].distance.text;
      directions[x]=holder.replace(/<\/?[^>]+(>|$)/g, ' ');
      directions[x]=directions[x].replace(/  /g, ' ');
      console.log(directions[x]);
      console.log(endLats[x]);
      console.log(endLons[x]);
      console.log(dists[x]);
    }
    },
  function(error) {
    console.log('Download failed: ' + lat +" "+lon+ " "+placeIDs[0]);
  }
  );
}