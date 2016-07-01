app.controller("mapCtrl",function($scope, $http, authFactory, itemStorage){

  /*************************
          Map Part
  **************************/
  
  $scope.total_record=0;//if needed???
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


    //set start & End marker
    function setMarker(end){
      var start=new google.maps.LatLng(44.414081, -110.578480);

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

  //set milestone markers
  var setMilestone=function(){
    itemStorage.getMilestone().then(function(response){
      for(var i=0;i<response.length;i++){
        // console.log(response[i]);
        new google.maps.Marker({
          position:response[i],
          map: map,
          icon: {
            url:'pics/coin.png',
            scaledSize: new google.maps.Size(30, 30)
          }
        });
      }
    })
  
  };
  setMilestone();


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
    var start=new google.maps.LatLng(44.414081, -110.578480);

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
    var total_miles=0;//figure out if needed???
    if($scope.userRecord.last_end==undefined){
      total_miles=input_miles;
      $scope.newUserPost(total_miles);
      // console.log("empty");
      $scope.total_record=total_miles;
      //update panel's progress bar
      $(".determinate").attr("style", "width:"+total_miles+"%");
      
      //update map
      $scope.translateIntoCoor(total_miles).then(function(end){
        initMap(end);
      });
    }else{
      // console.log("not empty");
      // console.log($scope.userRecord);
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

      //meet milestone pop up
      $scope.milestonePopUp(last_end_miles,total_miles);

      });
       
      })
    }
  };


  /*************************************
        Functions, from itemFactory.js
  *************************************/

  

  //translate into coordinate
  $scope.translateIntoCoor=function(input_miles){
    return new Promise(function(resolve,reject){
      itemStorage.translateIntoCoor(input_miles).then(function(response){
        resolve(response);
      })
    })
   };

  //get last time miles record
  $scope.userRecord={};
  $scope.getLastEnd=function(){
    return new Promise(function(resolve,reject){
      itemStorage.getLastEnd().then(function(response){
        $scope.userRecord=response;
        resolve($scope.userRecord);
        console.log($scope.userRecord);
      })
    })
  }


  //Update firebase last_end
  $scope.updateRecord=function(total_miles){
    var id=$scope.userRecord.id;
    itemStorage.updateRecord(total_miles,id).then(function(response){
    })
  };

  //new user miles post
  $scope.newUserPost=function(total_miles){
    itemStorage.newUserPost(total_miles).then(function(response){
    });
  };

  //test milestone pop up
  $scope.milestonePopUp=function(last_end_miles,total_miles){
    itemStorage.getMilestone().then(function(response){
      for(var i=0;i<response.length;i++){
        if((response[i].mile<=total_miles)&(response[i].mile>last_end_miles)){
        //pop up milestone resort, close after 2secs
        setTimeout(function(){$('#modal1').openModal();},1000);
        $('#modalImage').attr("src",response[i].pic);
        $('#modalHeader').html("You passed: "+response[i].title);
        
        setTimeout(function(){$('#modal1').closeModal();},3000);
        }
      }
        
    })
  }


})





