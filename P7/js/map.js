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
      this.tempLatLng = e.latLng;
      this.showModalResto();
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      $("#formulaire2").off('submit');
      $("#formulaire2").on('submit', (e) => {
        e.preventDefault();
        const name = $('#nomResto').val();
        const adresse = $('#adresseResto').val();
        const types = $('#typeResto').val();
        const newpid = this.makeid(20);
        this.newMarkerOnClick(this.tempLatLng, map);
        $('#modalResto').hide();

        $('#listeRestaurants').append(`
          <div class='divResto'>
          <hr>
          <h1 class='resto' pid='` + newpid + `'>` + name + `</h1>
          <div class='infos jojo' pid='` + newpid + `'>
          <p>Adresse : ` + adresse + `</p>
          <p>Types : ` + types + `</p></div>
          <hr class='commentDivider'>
          <div class='infos note' pid='` + newpid + `'></div>
          <div class='infos reviews jojo' pid='` + newpid + `'></div>
          <img class='infos jojo' src='https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&key=AIzaSyD9pPh0g-PyI0ci93F2KJxy8v9zQC1TSNE' pid='` + newpid + `'/>
          <button class='infos jojo buttonAdd' pid='` + newpid + `' type='button'>Ajouter un commentaire</button>
          </div>`)
        this.listenClickAdd(newpid);
        console.log("e : ",e);
      })
    })
  }

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  showModalResto() {
    /* modal restaurants */
    let btn = $("#sendFormResto");
    let modal = $("#modalResto");
    let span = $("#spanResto");

    /* Reset valeur modal resto */
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

  listenClickAdd(place_id) { 
    /* supprimer cette classe en gardant this.liste.formComment() et en appelant showmodalComment à la place*/
    let btn = $('#sendFormComment');
    let modal = $('#modalCom');
    let span = $('#spanCom');

    $(`.buttonAdd[pid='${place_id}']`).off('click')
    $(`.buttonAdd[pid='${place_id}']`).on('click', (e) => {
      /* Reset valeur modal commentaire */
      $('#nomForm').val('');
      $('#comForm').val('');

      $('#formulaire1').attr('pid', place_id);
      $(modal).show();
      let pidform = $(e).attr('pid');
      $('#formulaire').attr('pid', pidform);
    })

    this.liste.formComment();

    $(span).off('click');
    $(span).on('click', () => {
      $(modal).hide();
    })
    $(document).on('click', (event) => {
      if ($(event.target).is(modal)) {
        $(modal).hide();
      }
    })
  }
}


/* A faire 

- faire fonctionner la méthode listenClickAdd(place_id) pour qu'on puisse ajouter un commentaire sur les nouveaux restaurants.

*/