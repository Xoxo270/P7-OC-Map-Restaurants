class Liste {
  constructor(mapObjet) {
    this.mapObjet = mapObjet;
  }

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
    <div class='infos jojo' pid='${place.place_id}'><p class="toto">Adresse : ${place.vicinity}</p>
    <p class="toto">Types: ${place.types.join(', ')}</p>
    </div>
    <div class='infos note' pid='${place.place_id}'></div>
    <div class='infos reviews jojo' pid='${place.place_id}'></div>
    <img class='infos jojo' pid='${place.place_id}' src='https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${place.geometry.location.lat()},${place.geometry.location.lng()}&key=AIzaSyD9pPh0g-PyI0ci93F2KJxy8v9zQC1TSNE'/>
    <button class='infos jojo buttonAdd' pid='${place.place_id}' type='button'>Ajouter un commentaire</button>
    </div>`);

    $(`.note[pid=${place.place_id}]`).rateYo({
      rating: place.rating,
      readOnly: true
    });
    this.showModalComment(place);
  }

  filterResto() {
    $('.resto').each((i, e) => {
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
    $(document).on("click", '.resto', (e) => {
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

    $('.jojo[pid="' + $(target).attr("pid") + '"]').toggleClass('toshow');      

      $(`.infos.reviews[pid="${target.place_id}"]`).rateYo(`${request.rating}`);
      service.getDetails(request, this.addReviews);
    })
  }

  toggleHidden(targetinfos) {
    var style = window.getComputedStyle(targetinfos);
    return (style.display === 'none');
  }

  formComment() {
    $("#formulaire1").off("submit");
    $("#formulaire1").on("submit", (e) => {
      console.log("e.attr : ", $(e.currentTarget).attr("pid"));
      e.preventDefault();
      let nom = $('#nomForm').val();
      let note = $('#noteForm').val();
      let comment = $('#comForm').val();

      $('.reviews[pid="' + $(e.currentTarget).attr("pid") + '"]').append(`<div class="commentPlaces"><p>` + nom + `</p>
      <p class="ratingClient">` + note + `/5 -` + comment + `</p><hr class="commentDivider"></div>`)

      $('#modalCom').hide();
    })
  }
  showModalComment(place) {
    /* modal commentaires */
    let btn = $('#sendFormComment');
    let modal = $('#modalCom');
    let span = $('#spanCom');
    console.log("place : ", place);

    $(`.buttonAdd[pid='${place.place_id}']`).off('click')
    $(`.buttonAdd[pid='${place.place_id}']`).on('click', (e) => {
      /* Reset valeur modal commentaire */
      $('#nomForm').val('');
      $('#comForm').val('');

      $('#formulaire1').attr('pid', place.place_id);
      $(modal).show();
      let pidform = $(this).attr('pid');
      $('#formulaire').attr('pid', pidform);
    })

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


/* ce qu'on doit faire cette semaine :
- récupérer le bouton "ajouter un commentaire" sur les nouveaux restaurants.
-
-
-
-
-
-
*/