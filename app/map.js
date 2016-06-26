app.controller("mapCtrl",function($scope, $http, authFactory){

  /*************************
          Map Part
  **************************/
  
  
  initMap=function(endCoor) {
    //set initial end or pass value

    //set the loading spinner inactive
    $("#loaderDiv").attr("class", "preloader-wrapper big inactive");

    //bottom--first
    var rendererOptions1 = {
      map: map,
      polylineOptions: {
        strokeColor: 'red'
      }
    };

    // top--second
    var rendererOptions2 = {
      map: map,
      polylineOptions: {
        strokeColor: 'green',
        strokeWeight: 4
      }
    };

    var directionsDisplay1 = new google.maps.DirectionsRenderer(rendererOptions1);
    var directionsDisplay2 = new google.maps.DirectionsRenderer(rendererOptions2);

    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 18,
      center: {lat: 44.414373, lng: -110.578392},
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    map.setTilt(45);

    directionsDisplay1.setMap(map);
    directionsDisplay2.setMap(map);
    //suppress the origin markers
    directionsDisplay1.setOptions({suppressMarkers: true});
    directionsDisplay2.setOptions({suppressMarkers: true});
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

    //for a coming back user, show his/her previous record
    if(endCoor===undefined){
      $scope.getLastEnd().then(function(response){
          var last_end_miles=response.last_end;
          //show last time record on the panel
          $scope.total_record=last_end_miles;

          $scope.translateIntoCoor(last_end_miles).then(function(response){
            var end=response;
            setMarker(end);
            
          })
      })
    }else{
      //show his/her updated panel record
      var end=endCoor;
      setMarker(end);
    };


    //set marker
    function setMarker(end){
      var start=new google.maps.LatLng(44.414373,-110.578392);

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
          url:'pics/mario.png',
          scaledSize: new google.maps.Size(60, 80)
        }
      });
    };


  calculateAndDisplayRoute(directionsService, directionsDisplay1, directionsDisplay2, end);
  };
    


  function calculateAndDisplayRoute(directionsService, directionsDisplay1,directionsDisplay2, endCoor){
    
    if(endCoor===undefined){
      $scope.getLastEnd().then(function(response){
          var last_end_miles=response.last_end;
          $scope.translateIntoCoor(last_end_miles).then(function(response){
            var end=response;
            var last_end=response;
            generateDirection(end,last_end);
          })
      });

    }else{
      var end=endCoor;
      //get last_end
      $scope.getLastEnd().then(function(response){
          var last_end_miles=response.last_end;
          $scope.translateIntoCoor(last_end_miles).then(function(response){
            var last_end=response;
            generateDirection(end,last_end);
          })
      })
    };



        
  function generateDirection(end,last_end){
    var start=new google.maps.LatLng(44.414373,-110.578392);

    var request1={
      origin: start,  
      //bottom
      destination: end,
      // waypoints: [{location: {lat: 44.420273,lng: -110.573757}}],
      // optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    };

    var request2={
      origin: start, 
      //top--> change this into last time
      destination: last_end,
      // waypoints: [{location: {lat: 44.420273,lng: -110.573757}}],
      // optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    };


    
    directionsService.route(request1,function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {

        directionsDisplay1.setDirections(response);
        console.log(response.request.destination);

      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    directionsService.route(request2,function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {

        directionsDisplay2.setDirections(response);
        console.log(response.request.destination);
        
        //set the scale still
        // directionsDisplay.setOptions({ preserveViewport: true });
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });


  };
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
  $scope.panelToMap=function(input_miles){
    var total_miles=0;
    if($scope.userRecord.last_end==undefined){
      total_miles=input_miles;
      $scope.newUserPost(total_miles);
      console.log("empty");
      $scope.total_record=total_miles;
      //update panel's progress bar
      $(".determinate").attr("style", "width:"+total_miles+"%");
      
      //update map
      $scope.translateIntoCoor(total_miles).then(function(end){
        initMap(end);
      });
    }else{
      console.log("not empty");
      console.log($scope.userRecord);
      $scope.getLastEnd().then(function(response){
      
      var last_end_miles=response.last_end;

      total_miles=input_miles+last_end_miles;
      //update firebase
      $scope.updateRecord(total_miles);
      $scope.total_record=total_miles;
      //update panel's progress bar
      $(".determinate").attr("style", "width:"+total_miles+"%");
      
      //update map
      $scope.translateIntoCoor(total_miles).then(function(end){
        initMap(end);
      });

      //update the panel total miles
       
      })
    }
  };

  //translate into coordinate
  $scope.translateIntoCoor=function(input_miles){
    return new Promise(function(resolve,reject){

      $http.get("data/dictionary.json")
      .success(function(response){
        var key_mile=Object.keys(response);

        for(i=0;i<key_mile.length;i++){
          if(key_mile[i]==input_miles){
            var end={};
            end.lat=response[key_mile[i]].lat;
            end.lng=response[key_mile[i]].lng;
            resolve(end);
          };
        }

      });
    })
   };

  //get last_end record from firebase
  $scope.userRecord={};
  $scope.getLastEnd=function(){
    var user=authFactory.getUser();
    return new Promise(function(resolve,reject){
      $http.get(`https://runtheresortsylvia.firebaseio.com/userRecords.json?orderBy="uid"&equalTo="${user.uid}"`)
    .success(function(response){
      Object.keys(response).forEach(function(key){
        response[key].id=key;
        $scope.userRecord=response[key];
        console.log($scope.userRecord);
      resolve($scope.userRecord);
      })
    })
    })
  };


  //Update firebase last_end
  $scope.updateRecord=function(total_miles){
    var user=authFactory.getUser();
    var id=$scope.userRecord.id;
    $http.put("https://runtheresortsylvia.firebaseio.com/userRecords/"+id+".json",
      JSON.stringify({
        last_end: total_miles,
        uid:user.uid
      })
    ).success(function(response){

    })
  };

  //new user miles post
  $scope.newUserPost=function(total_miles){
    var user=authFactory.getUser();
    $http.post("https://runtheresortsylvia.firebaseio.com/userRecords/.json",
      JSON.stringify({
        last_end:total_miles,
        uid:user.uid
      }))
    .success(function(response){

    })
  };


})





