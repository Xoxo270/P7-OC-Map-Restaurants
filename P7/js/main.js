
function initialize(position) {
  let request = {
    radius: '1000',
    type: ['restaurant']
  };
  var pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  infoWindow = new google.maps.InfoWindow;

  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    zoom: 15
  });

  service = new google.maps.places.PlacesService(map);
  request.location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  service.nearbySearch(request, callback);

  infoWindow.setPosition(pos);
  infoWindow.setContent('Location found.');
  infoWindow.open(map);

  $.getJSON( "./../json/liste.json", function( data ) {
    /* console.log(data); */
    let items = [];
    data.forEach(function(key) {
      /* console.log(key.lat); */
      let tbl = {lat:key.lat, lng:key.long};
      new google.maps.Marker({position:tbl, map:map});
    });
  })
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function createMarker(place){
  let tbl = {lat:place.geometry.location.lat(), lng:place.geometry.location.lng()};
  new google.maps.Marker({position:tbl, map:map});
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      let place = results[i];
      createMarker(place); 
    }
  }
  console.log("les restos proches : ",results);
}