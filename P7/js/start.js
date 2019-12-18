function initMap() {
    let fallBackPosition = {
        coords : {
            lat : 48.8344643,
            lng :2.3769014
        }
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            initialize(position);
        }, function() { initialize(fallBackPosition);
        });
      } else {
        initialize(fallBackPosition);
      }
} 