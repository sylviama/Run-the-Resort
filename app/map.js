app.controller("mapCtrl",function($scope, $http){

  /*************************
          Map Part
  **************************/
  
  
  initMap=function(endCoor) {
    //set initial end or pass value
    if(endCoor===undefined){
      var end={lat: 44.414373, lng: -110.578392}
    }else{
      var end=endCoor;
    }

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
    calculateAndDisplayRoute(directionsService, directionsDisplay,end);
  };
    


  function calculateAndDisplayRoute(directionsService, directionsDisplay,endCoor) {
    
    var start=new google.maps.LatLng(44.414373,-110.578392);

    if(endCoor===undefined){
      var end={lat: 44.414373,lng: -110.578392};
    }else{
      var end=endCoor;
    }

    var request= {
      origin: start,  
      destination: end,
      waypoints: [{location: {lat: 44.420273,lng: -110.573757}}],
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
  };

  //load google API
  loadScript=function(){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyC74Sv-Oj1eczsYPOuzrDveO0SmkcW3Dj0&callback=initMap";
    document.body.appendChild(script);
  };

  angular.element(document).ready(loadScript);


  /*************************
          Panel Part
  **************************/

  //translate into coordinate
  $scope.translateIntoCoor=function(input_miles){
    console.log(input_miles);
    $http.get("app/dictionary.json")
    .success(function(response){
      var key_mile=Object.keys(response);

      for(i=0;i<key_mile.length;i++){
        if(key_mile[i]==input_miles){
          console.log(key_mile[i]);
          var end={};
          end.lat=response[key_mile[i]].lat;
          end.lng=response[key_mile[i]].lng;
          initMap(end);
          console.log(end);
        };
      }

    });
   };
// $scope.translateIntoCoor();
});





