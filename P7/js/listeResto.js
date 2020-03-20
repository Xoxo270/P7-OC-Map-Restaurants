class Liste {
  addReviews(result, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      let tblReview = `<p>Aucun commentaire(s) !</p>`;
      if (result.reviews !== undefined) {
        tblReview = '';
        result.reviews.forEach((review) => {
          tblReview += `<div class="commentPlaces"><p><img class="profilePic" src="${review.profile_photo_url}"> ${review.author_name}</p>
            <p class="ratingClient">${review.rating}/5 -
            ${review.text}</p><hr class="commentDivider"></div>`;
        });
      }
      $(`.infos.reviews[pid="${result.place_id}"]`).html(`${tblReview}`);
    }
  }

  listeRestos(place) {
    $("#listeRestaurants").append(`
    <div class='divResto'>
    <hr>
    <div class='resto' pid='${place.place_id}' rating='${place.rating}' ><img src="${place.icon}"></div>
    <h1 class='resto' pid='${place.place_id}' rating='${place.rating}' >${place.name}</h1>
    <div class='infos' pid='${place.place_id}'><p class="toto">Adresse : ${place.vicinity}</p>
    <p class="toto">Types: ${place.types.join(', ')}</p>
    </div>
    <div class='infos note' pid='${place.place_id}'></div>
    <div class='infos reviews' pid='${place.place_id}'></div>
    <img class='infos' pid='${place.place_id}' src='https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${place.geometry.location.lat()},${place.geometry.location.lng()}&key=AIzaSyD9pPh0g-PyI0ci93F2KJxy8v9zQC1TSNE'/>
    <button class='infos buttonAdd' pid='${place.place_id}' type='button'>Ajouter un commentaire</button>
    </div>`);

    $(`.note[pid=${place.place_id}]`).rateYo({
      rating: place.rating
    });
    this.showModalComment(place);
  }

  filterResto() {
    $('.resto').each((i,e) => {
      let ratingNB = parseFloat($(e).attr("rating"));
      if (ratingNB < notemini || ratingNB > notemaxi || isNaN(ratingNB)) {
        $(e).parent().hide();
      } else {
        $(e).parent().show();
      }
    })
    markers.forEach((elem) => {
      if (elem.rating < notemini || elem.rating > notemaxi || isNaN(elem.rating)) {
        elem.marker.setVisible(false);
      } else {
        elem.marker.setVisible(true);
      }
    })
  }

  clicResto(restaurants) {
    $(".resto").on("click", (e) => {
      let target = e.target;
      let targetinfos = $('.infos[pid="' + $(target).attr("pid") + '"] ');
      var request = {
        placeId: $(target).attr("pid"),
        fields: ['opening_hours', 'rating', 'reviews', 'place_id']
      }
      var resto = restaurants.filter((restaurant) => {
        return restaurant.place_id == $(target).attr("pid");
      })
      let place = resto[0];
      if (this.toggleHidden(targetinfos[0])) {
        targetinfos[0].style.display = "block";
        targetinfos[2].style.display = "block";
        targetinfos[3].style.display = "block";
        targetinfos[4].style.display = "block";
      } else {
        targetinfos[0].style.display = "none";
        targetinfos[2].style.display = "none";
        targetinfos[3].style.display = "none";
        targetinfos[4].style.display = "none";
      }
      $(`.infos.reviews[pid="${target.place_id}"]`).rateYo(`${request.rating}`);
      service.getDetails(request, this.addReviews);
    })
  }

  toggleHidden(targetinfos) {
    var style = window.getComputedStyle(targetinfos);
    return (style.display === 'none')
  }

  formComment() {
    $("#formulaire").on("submit", (e) => {
      e.preventDefault();
      let nom = $('#nomForm').val();
      let comment = $('#comForm').val();
      $('.reviews[pid="' + $(this).attr("pid") + '"]').append('<p>' + nom + '<p><p>' + comment + '<p>')
    })
  }
  /* essai1(){   
     $(span).on('click', () => {
      $(modal).hide();
    })
    $(document).on('click', (event) => {
      if ($(event.target).is(modal)) {
        $(modal).hide();
      }
    })
     $(btn).on('click', () => {
      $(modal).hide();
    }) 
  } */
  showModalComment(place) {
    let btn = $('#sendFormComment');
    let modal = $('#modalCom');
    let span = $('#spanCom');

    /* Le click sur le bouton déclenche l'apparition du modal */
    $(`.buttonAdd[pid='${place.place_id}']`).on('click', () => {
      $(modal).show();
      let pidform = $(this).attr('pid');
      $('#formulaire').attr('pid', pidform);
    })
    /* this.essai1(); */

    /* Le click sur le span ou sur le bouton fait disparaitre le modal */
    $(span).on('click', () => {
      $(modal).hide();
    })

    /* Le click en dehors de la fenêtre fait disparaitre le modal */
    $(document).on('click', (event) => {
      if ($(event.target).is(modal)) {
        $(modal).hide();
      }
    })
    $(btn).on('click', () => {
      $(modal).hide();
    })
  }

  showModalResto() {
    let btn = $("#sendFormResto");
    let modal = $("#modalResto");
    let span = $("#spanResto");

    $(modal).show();

    $(span).on('click', () => {
      $(modal).hide();
    })
    $(document).on('click', (event) => {
      if ($(event.target).is(modal)) {
        $(modal).hide();
      }
    })
    $(btn).on('click', () => {
      $(modal).hide();
    })
  }

  selectRatingMin() {
    $(() => {
      $("#noteMin").rateYo({
        onSet: (rating) => {
          notemini = rating;
          this.filterResto();
        }
      }).rateYo("rating", 0);
    });
  }
  selectRatingMax() {
    $(() => {
      $("#noteMax").rateYo({
        onSet: (rating) => {
          notemaxi = rating;
          this.filterResto();
        }
      }).rateYo("rating", 5);
    });
  }
}

/*
- Un formulaire pour ajouter un restaurant lorsqu'on clique sur la carte.
- Faire du css pour rendre le tout plus beau.
- POO.

- faire des constructor pour les commentaires et pour les restos ?

- virer les variables globales.
- enlever les restos de la liste quand ils ne correspondent pas aux critères du filtre étoiles.
*/


/* Formulaire restaurant 
Nom
adresse
streetview
*/





/* ce qu'on a fait cette semaine :
- Débugage ( beaucoup ).
- Tests de fonction réutilisable.
- débug de la liste des restos qui ne s'affichait pas ( covid qui fait fermer les restos )
- débug du filtre RateYo.
- Ajout d'un if/else dans add/reviews pour vérifier si result.review est undefined.
*/