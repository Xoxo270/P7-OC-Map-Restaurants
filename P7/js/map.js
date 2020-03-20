class MapClass {
  constructor(liste) {
    this.liste = liste;
  }
  createMarker(place) {
    let tbl = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    markers.push({
      rating: place.rating,
      marker: new google.maps.Marker({
        position: tbl,
        map: map
      })
    })
  }
  callback(results, status) { /* Anciennement callback() */
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      restaurants = results;
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        this.createMarker(place);
        this.liste.listeRestos(place);
      }
      this.liste.clicResto(restaurants)
    }
  }

  clickMap() {
    map.addListener('click', (e) => {
      this.newMarkerOnClick(e.latLng, map);
      this.liste.showModalResto();
      console.log(e);
      $("#formulaire2").on('submit', (e) => {
        e.preventDefault();
        var name = $('#nomResto').val();
        var adresse = $('#adresseResto').val();
        var types = $('#typeResto').val();
        $('#listeRestaurants').append(`<div class='divResto'><div class='resto'>
          <h1 class='resto'>` + name + `</h1>
          <div class="infos"><p>Adresse : ` + adresse + `</p>
          <p>Types : ` + types + `</p></div>
          </div></div>`)
      })
    })
  }

  newMarkerOnClick(latLng, map) {
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
    map.panTo(latLng);
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Erreur: La géolocalisation a échouée.' :
      'Erreur: Votre navigateur ne supporte pas la géolocalisation.');
    infoWindow.open(map);
  }
}