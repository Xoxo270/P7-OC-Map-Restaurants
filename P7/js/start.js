class MiseEnRoute {
  constructor(mapObjet, liste) {
    this.mapObjet = mapObjet;
    this.liste = liste;
    /* coordonnées par défaut */

    let fallBackPosition = {
      coords: {
        lat: 48.8344643,
        lng: 2.3769014
      }
    }
    console.log(fallBackPosition);
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: fallBackPosition.coords.lat,
        lng: fallBackPosition.coords.lng
      },
      zoom: 15
    });

    /* Géolocalisation si possible */
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.initialize(position);
      }, () => {
        this.initialize(fallBackPosition);
        this.mapObjet.handleLocationError(true, infoWindow, fallBackPosition);
      });
    } else {
      this.initialize(fallBackPosition);
      this.mapObjet.handleLocationError(false, infoWindow, fallBackPosition);
    }
  }

  /* Initialisation de la map et récupération des restaurants à proximité */
  initialize(position) {
    let request = {
      radius: '1000',
      type: ['restaurant']
    };
    let pos = {
      lat: position.coords.lat,
      lng: position.coords.long
    };
    infoWindow = new google.maps.InfoWindow;

    map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 15
    });

    service = new google.maps.places.PlacesService(map);
    request.location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    service.nearbySearch(request, (results, status) => {
      this.liste.addApiResults(results, status)
    });

    infoWindow.setPosition(pos);
    infoWindow.setContent('Localisation trouvée.');
    infoWindow.open(map);

    this.mapObjet.clickMap();
    this.liste.formComment();
    this.liste.selectRatingMin();
    this.liste.selectRatingMax();

    /* Récupération des restaurants dans le json et ajout sur la carte */
    $.getJSON("./../json/liste.json", (data) => {
      data.forEach((id) => {
        let tbl = {
          lat: id.lat,
          lng: id.long
        };

        let newMarker = new google.maps.Marker({
          position: tbl,
          map: map,
          title: id.restaurantName
        });

        let popupinfos = `<div id="content"><h1>${id.restaurantName}</h1>
        <div> ${id.address}</div></div>`;
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
          marker: newMarker
        })

        const newpid = this.mapObjet.makeid(20);

        $('#listeRestaurants').append(`
          <div class='divResto'>
            <hr>
            <div class='resto' pid='${newpid}' ><img src="https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png"></div>
            <h1 class='resto' pid='${newpid}'>${id.restaurantName}</h1>
            <div class='infos hide' pid='${newpid}'>
              <p>Adresse : ${id.address}</p>
            </div>
            <div class='infos note' pid='${newpid}'></div>
            <div class='infos reviews hide' pid='${newpid}'>${id.address}</div>
            <img class='infos hide' src='https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${tbl.lat},${tbl.lng}&key=AIzaSyD9pPh0g-PyI0ci93F2KJxy8v9zQC1TSNE' pid='${newpid}'/>
            <button class='infos hide buttonAdd' pid='${newpid}' type='button'>Ajouter un commentaire</button>
          </div>`)

        $(`.note[pid=${newpid}]`).rateYo({
          rating: id.note,
          readOnly: true
        });

        let tblReview = `<p>Aucun commentaire(s) !</p>`;
        if (id.ratings !== undefined) {
          tblReview = '';
          id.ratings.forEach((ratings) => {
            tblReview += `<div class="commentPlaces"><p><img class="profilePic" src="https://lh6.ggpht.com/-wiU-cqAjhwY/AAAAAAAAAAI/AAAAAAAAAAA/AT9mW9moABY/s128-c0x00000000-cc-rp-mo-ba3/photo.jpg"></p>
              <p class="ratingClient">${ratings.stars}/5 - ${ratings.comment}</p><hr class="commentDivider"></div>`;
          })
        }
        $(`.infos.reviews[pid="${newpid}"]`).append(`${tblReview}`);

        this.liste.showModalComment(newpid);
        this.liste.formComment();
      });
    })
  }
}