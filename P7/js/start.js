class MiseEnRoute {
  constructor(mapObjet, liste) {
    this.mapObjet = mapObjet;
    this.liste = liste;
    let fallBackPosition = {
      coords: {
        lat: 48.8344643,
        lng: 2.3769014
      }
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.initialize(position);
      }, () => {
        this.initialize(fallBackPosition);
      });
    } else {
      this.initialize(fallBackPosition);
    }
  }

  initialize(position) {
    let request = {
      radius: '2000',
      type: ['restaurant']
    };
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    let infoWindow = new google.maps.InfoWindow;

    map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 15
    });

    service = new google.maps.places.PlacesService(map);
    request.location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    service.nearbySearch(request, (results, status) => {
      this.mapObjet.callback(results, status)
    });

    infoWindow.setPosition(pos);
    infoWindow.setContent('Localisation trouvée.');
    infoWindow.open(map);
    this.mapObjet.clickMap();
    this.liste.formComment();
    this.liste.selectRatingMin();
    this.liste.selectRatingMax();

    $.getJSON("./../json/liste.json", (data) => {
      let items = [];
      data.forEach((key) => {
        let tbl = {
          lat: key.lat,
          lng: key.long
        };
        new google.maps.Marker({
          position: tbl,
          map: map
        });
      });
    })
  }

}