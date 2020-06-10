class MapClass {
  constructor(liste) {
    this.liste = liste;
  }

  /* fonction qui écoute le clic de la map et en récupère les coordonnées */
  clickMap() {
    map.addListener('click', (e) => {
      this.tempLatLng = e.latLng;
      this.showModalResto();
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      /* Récupération des infos du formulaire qui apparait au clic sur la map */
      $("#formulaire2").off('submit');
      $("#formulaire2").on('submit', (e) => {
        e.preventDefault();
        const name = $('#nomResto').val();
        const adress = $('#adresseResto').val();
        const types = $('#typeResto').val();
        const newpid = this.makeid(20);
        this.newMarkerOnClick(this.tempLatLng, map);
        $('#modalResto').hide();

        /* Ajout du restaurant à la liste */
        $('#listeRestaurants').append(`
          <div class='divResto'>
          <hr>
          <img src="https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png">
          <h1 class='resto' pid='${newpid}'>${name}</h1>
          <div class='infos hide' pid='${newpid}'>
          <p>Adresse : ${adress}</p>
          <p>Types : ${types}</p></div>
          <div class='infos note' pid='${newpid}'></div>
          <div class='infos reviews hide' pid='${newpid}'></div>
          <img class='infos hide' src='https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&key=AIzaSyD9pPh0g-PyI0ci93F2KJxy8v9zQC1TSNE' pid='${newpid}'/>
          <button class='infos hide buttonAdd' pid='${newpid}' type='button'>Ajouter un commentaire</button>
          </div>`)
        this.liste.showModalComment(newpid);
        this.liste.formComment();
      })
    })
  }

  /* création des markers sur la carte + popup avec infos lorsqu'on clique dessus */
  createMarker(place) {
    let popupinfos = `<div id="content"><h1>${place.name}</h1>
    <div> ${place.vicinity}</div>
    <div>${place.types.join(', ')}</div> </div>`;
    let tbl = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    let newMarker = new google.maps.Marker({
      position: tbl,
      map: map,
    })
    newMarker.infowindow = new google.maps.InfoWindow({
      content: popupinfos
    });
    newMarker.addListener('click', function () {
      markers.forEach(marker => {
        marker.marker.infowindow.close();
      })
      newMarker.infowindow.open(map, newMarker);
    });
    markers.push({
      rating: place.rating,
      marker: newMarker
    })
  }

  /* Création d'un place_id pour les nouveaux restaurants */
  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /* Reset des valeurs du modal et écoute du clic pour faire apparaitre/disparaitre le modal */
  showModalResto() {
    let btn = $("#sendFormResto");
    let modal = $("#modalResto");
    let span = $("#spanResto");

    $('#nomResto').val('');
    $('#adresseResto').val('');
    $('#typeResto').val('');

    $(modal).show();

    $(span).off('click');
    $(span).on('click', () => {
      $(modal).hide();
    })
    $(document).off('click', '#sendFormResto');
    $(document).on('click', '#sendFormResto', (event) => {
      if ($(event.target).is(modal)) {
        $(modal).hide();
      }
    })
  }

  /* Ajout d'un marker sur la carte par rapport au click de clickMap() */
  newMarkerOnClick(latLng, map) {
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: name
    });
    map.panTo(latLng);
  }

  /* Fonction pour la géolocalisation et l'envoi de messages d'erreur */
  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    console.log(pos);
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Erreur: La géolocalisation a échouée.' :
      'Erreur: Votre navigateur ne supporte pas la géolocalisation.');
    infoWindow.open(map);
  }
}