var map;
var service;
var infowindow;

function initMap() {
    initialize();
} 




function initialize() {
  var paris = new google.maps.LatLng(48.8344643,2.3769014);

  map = new google.maps.Map(document.getElementById('map'), {
      center: paris,
      zoom: 15
    });

  var request = {
    location: paris,
    radius: '500',
    type: ['restaurant']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);



  $.getJSON( "liste.json", function( data ) {
    console.log(data);
    var items = [];
    $.each( data, function( key, val ) {
      items.push( "<li id='" + key + "'>" + val + "</li>" );
    });
   
    $( "<ul/>", {
      "class": "my-new-list",
      html: items.join( "" )
    }).appendTo( "#liste" );
  });
}

function createMarker(place){
  var tbl = {lat:place.geometry.location.lat(), lng:place.geometry.location.lng()};
  new google.maps.Marker({position:tbl, map:map});
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(place); 
    }
  }
}


