/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');

var main = new UI.Card({
  title: 'FOOD PLACES',
  body: 'Pick a food place near you.'
});

main.show();

var nearby_restaurants = {
  
  title: 'Nearby Restaurants',
  
  items: [{ // Food place 1
        title: 'Restaurant Title 1',
      }, { // Food place 2
        title: 'Restaurant Title 2',
      },
      { // Food place 3
        title: 'Restaurant Title 3',
      },
      { // Food place 4
        title: 'Restaurant Title 4',
      },
      { // Food place 5
         title: 'Restaurant Title 5',
      }]
  
};

var nearby_theaters = {
  
  title: 'Nearby Movie Theaters',
  
  items: [{ // Food place 1
        title: 'Movie Theater 1',
      }, { // Food place 2
        title: 'Movie Theater 2',
      },
      { // Food place 3
        title: 'Movie Theater 3',
      },
      { // Food place 4
        title: 'Movie Theater 4',
      },
      { // Food place 5
         title: 'Movie Theater 5',
      }]
  
};

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [nearby_restaurants,nearby_theaters]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
