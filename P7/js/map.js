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
  callback(results, status) {
    /* Anciennement callback() */
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
      let eventClick = e;
      $("#formulaire2").on('submit', (e) => {
        e.preventDefault();
        const name = $('#nomResto').val();
        const adresse = $('#adresseResto').val();
        const types = $('#typeResto').val();
        const lat = $(eventClick.latLng.lat());
        const lng = $(eventClick.latLng.lng());
        let newpid = this.makeid(20);

        $('#listeRestaurants').append(`<div class='divResto'>
          <hr>
          <div class='resto'>
          <h1 class='resto' pid='`+ newpid +`'>` + name + `</h1>
          <div class="infos" pid='`+ newpid +`'>
          <p>Adresse : ` + adresse + `</p>
          <p>Types : ` + types + `</p>
          <img class='infos' src='https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&key=AIzaSyD9pPh0g-PyI0ci93F2KJxy8v9zQC1TSNE'/>
          </div></div></div>`)
      })
    })
  }

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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