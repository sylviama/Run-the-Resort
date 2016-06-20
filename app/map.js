// start point:44.414373, -110.578392
// 0.5:44.420273,-110.573757
function initMap() {
  //set the loading spinner inactive
  $("#loaderDiv").attr("class", "preloader-wrapper big inactive");
  
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: {lat: 44.414373, lng: -110.578392},
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
  map.setTilt(45);
  directionsDisplay.setMap(map);
  directionsDisplay.setOptions({suppressMarkers: true});
  //set map style
  map.set('styles', [
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        { color: 'blue' },
        { weight: 5 }
      ]
    }, {
      featureType: 'road',
      elementType: 'labels',
      stylers: [
        { saturation: -100 },
        { invert_lightness: true }
      ]
    }, 
    // {
    //   featureType: 'landscape',
    //   elementType: 'geometry.fill',
    //   stylers: [
    //     { hue: '#ffff00' },
    //     { gamma: 1.4 },
    //     { saturation: 82 },
    //     { lightness: 96 }
    //   ]
    // }, 
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        { hue: 'green' },
        { lightness: -15 },
        { saturation: 20 }
      ]
    }
  ]);

  var start=new google.maps.LatLng(44.414373,-110.578392);
  var end=new google.maps.LatLng(44.426608,-110.576784);
  //marker
  var start_marker = new google.maps.Marker({
    position:start,
    map: map,
    icon: {
      url:'pics/start2.png',
      scaledSize: new google.maps.Size(50, 50)
    }
  });
  var end_marker = new google.maps.Marker({
    position:end,
    map: map,
    icon: {
      url:'pics/princess.png',
      scaledSize: new google.maps.Size(60, 80)
    }
  });
  calculateAndDisplayRoute(directionsService, directionsDisplay);
};
  
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  
  var start=new google.maps.LatLng(44.414373,-110.578392);
  var request= {
    origin: start,  
    destination: {lat: 44.426608, lng: -110.576784},
    waypoints: [{location: new google.maps.LatLng(44.420273, -110.573757)}],
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request,function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      
      //set the scale still
      // directionsDisplay.setOptions({ preserveViewport: true });
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

