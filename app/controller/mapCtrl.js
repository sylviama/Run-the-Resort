app.controller("mapCtrl",function($scope, $http, authFactory, itemStorage){

  /*************************
          Map Part
  **************************/
  //default pick miles radio button
  $scope.showCal='mileRadio1';
  //this is for street view
  // var panorama;

  initMap=function(endCoor){

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
      // center: {lat: 44.414373, lng: -110.578392},
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    //legend
    var legend=document.getElementById('legend');
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);


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

    /************************************
        get "End" coordinator
        call setMarker
        street view
    **************************************/

    //for a coming back user(when no panel action yet), show his/her previous record
    if(endCoor===undefined){
      $scope.getLastEnd().then(function(response){
        var last_end_miles=response.last_end;
        var mapInfo=response.mapPick;
        //show last time record on the panel
        $scope.total_record=last_end_miles;
        var after_round_miles=(Math.round(last_end_miles*2))/2;
        $scope.translateIntoCoor(mapInfo,after_round_miles).then(function(response){
          var end=response;
          setMarker(mapInfo,end);

          //street view
          var panorama = map.getStreetView();
          panorama.setPosition(end);
          panorama.setPov(/** @type {google.maps.StreetViewPov} */({
            heading: 265,
            pitch: 0
          }));

          $scope.toggleStreetView=function(){
            var toggle = panorama.getVisible();
            if (toggle == false) {
              panorama.setVisible(true);
            } else {
              panorama.setVisible(false);
            }
          };
          console.log("no panel action");

        })
      })
    //when has panel action, end is already translated
    }else{
      var end=endCoor;
      //street view
      var panorama = map.getStreetView();
      panorama.setPosition(end);
      panorama.setPov(/** @type {google.maps.StreetViewPov} */({
        heading: 265,
        pitch: 0
      }));

      $scope.toggleStreetView=function(){
        var toggle = panorama.getVisible();
        if (toggle == false) {
          panorama.setVisible(true);
        } else {
          panorama.setVisible(false);
        }
      };
      //show his/her updated panel record
      $scope.getLastEnd().then(function(response){ 
        var mapInfo=response.mapPick;
        setMarker(mapInfo,end);
      })
    };

    console.log("has panel action");

    

    /************************************
        Start & End marker & maptype
    **************************************/

    function setMarker(mapInfo,end){
      var start;
      if(mapInfo==="yellowstone"){
        start=new google.maps.LatLng(44.414081, -110.578480);
        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        $("#legendText").html("Yellowstone");
      }else if(mapInfo==="grandCanyon"){
        start=new google.maps.LatLng(36.057194, -112.143602);
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        $("#legendText").html("Grand Canyon");
      }

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

  /*************************
    milestone and infoWindow
  **************************/
  var setMilestone=function(mapInfo){
    return new Promise(function(resolve,reject){

      //set milestone
      itemStorage.getMilestone(mapInfo).then(function(response){
        var milestone=[];
        for(var i=0;i<response.length;i++){
          var obj={};
          obj.marker= new google.maps.Marker({
            position:response[i],
            map: map,
            icon: {
              url:'pics/coin.png',
              scaledSize: new google.maps.Size(30, 30)
            }
          });

          //set infoWindow
          obj.infoWindow=new google.maps.InfoWindow({
            content: '<img src='+response[i].pic+' height=70px width=120px><br>'+response[i].title,
            position: response[i]
          }); 
          milestone.push(obj);
        }
      resolve(milestone);
      });
      
    })

  };

  //run milestone and click to open infoWindow
  $scope.getLastEnd().then(function(response){
    var mapInfo=response.mapPick;
    setMilestone(mapInfo).then(function(response){
      if(mapInfo==="yellowstone"){
        for(var i=0;i<response.length;i++){
          response[0].marker.addListener('click', function(event) {
            response[0].infoWindow.open(map, response[0].marker);
          })
          response[1].marker.addListener('click', function(event) {
            response[1].infoWindow.open(map, response[1].marker);
          })
          response[2].marker.addListener('click', function(event) {
            response[2].infoWindow.open(map, response[2].marker);
          })
          response[3].marker.addListener('click', function(event) {
            response[3].infoWindow.open(map, response[3].marker);
          })
          response[4].marker.addListener('click', function(event) {
            response[4].infoWindow.open(map, response[4].marker);
          })
          response[5].marker.addListener('click', function(event) {
            response[5].infoWindow.open(map, response[5].marker);
          })
          response[6].marker.addListener('click', function(event) {
            response[6].infoWindow.open(map, response[6].marker);
          })
          response[7].marker.addListener('click', function(event) {
            response[7].infoWindow.open(map, response[7].marker);
          })
          response[8].marker.addListener('click', function(event) {
            response[8].infoWindow.open(map, response[8].marker);
          })
          response[9].marker.addListener('click', function(event) {
            response[9].infoWindow.open(map, response[9].marker);
          })
          response[10].marker.addListener('click', function(event) {
            response[10].infoWindow.open(map, response[10].marker);
          })
          response[11].marker.addListener('click', function(event) {
            response[11].infoWindow.open(map, response[11].marker);
          })
          response[12].marker.addListener('click', function(event) {
            response[12].infoWindow.open(map, response[12].marker);
          })
          response[13].marker.addListener('click', function(event) {
            response[13].infoWindow.open(map, response[13].marker);
          })
          response[14].marker.addListener('click', function(event) {
            response[14].infoWindow.open(map, response[14].marker);
          })
        }
      } else if(mapInfo==="grandCanyon"){
        for(var i=0;i<response.length;i++){
          response[0].marker.addListener('click', function(event) {
            response[0].infoWindow.open(map, response[0].marker);
          })
          response[1].marker.addListener('click', function(event) {
            response[1].infoWindow.open(map, response[1].marker);
          })
          response[2].marker.addListener('click', function(event) {
            response[2].infoWindow.open(map, response[2].marker);
          })
          response[3].marker.addListener('click', function(event) {
            response[3].infoWindow.open(map, response[3].marker);
          })
          response[4].marker.addListener('click', function(event) {
            response[4].infoWindow.open(map, response[4].marker);
          })
        }
      }
    })
  })
  
  calculateAndDisplayRoute(directionsService, directionsDisplay1, directionsDisplay2, end);

};
    


  function calculateAndDisplayRoute(directionsService, directionsDisplay1,directionsDisplay2, endCoor){
    
    //pass "End" info
    //for the user without Panel action yet
    if(endCoor===undefined){
      $scope.getLastEnd().then(function(response){
        var last_end_miles=response.last_end;
        var after_round_miles=(Math.round(last_end_miles*2))/2;
        var mapInfo=response.mapPick;
        $scope.translateIntoCoor(mapInfo,after_round_miles).then(function(response){
          var end=response;
          var last_end=response;
          generateDirection(mapInfo,end,last_end);
          //street view
          // var panorama = map.getStreetView();
          // panorama.setPosition(end);
          // panorama.setPov(/** @type {google.maps.StreetViewPov} */({
          //   heading: 265,
          //   pitch: 0
          // }));

          // $scope.toggleStreetView=function(){
          //   var toggle = panorama.getVisible();
          //   if (toggle == false) {
          //     panorama.setVisible(true);
          //   } else {
          //     panorama.setVisible(false);
          //   }
          // };

        })
      });
    //for the user has a panel action
    }else{
      var end=endCoor;

      //get last_end
      $scope.getLastEnd().then(function(response){
        var last_end_miles=response.last_end;
        var after_round_miles=(Math.round(last_end_miles*2))/2;
        var mapInfo=response.mapPick;
        $scope.translateIntoCoor(mapInfo,after_round_miles).then(function(response){
          var last_end=response;

          //street view
          // var panorama = map.getStreetView();
          // panorama.setPosition(last_end);
          // panorama.setPov(/** @type {google.maps.StreetViewPov} */({
          //   heading: 265,
          //   pitch: 0
          // }));

          // $scope.toggleStreetView=function(){
          //   var toggle = panorama.getVisible();
          //   if (toggle == false) {
          //     panorama.setVisible(true);
          //   } else {
          //     panorama.setVisible(false);
          //   }
          // };

          console.log(last_end);
          generateDirection(mapInfo,end,last_end);
        })
      })
    };

    



        
  function generateDirection(mapInfo,end,last_end){

    var start;
    if(mapInfo==="yellowstone"){
      start=new google.maps.LatLng(44.414081, -110.578480);
    }else if(mapInfo==="grandCanyon"){
      start=new google.maps.LatLng(36.057194, -112.143602);
    }

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


    
    directionsService.route(request2,function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {

        directionsDisplay2.setDirections(response);

      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    directionsService.route(request1,function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {

        directionsDisplay1.setDirections(response);
        
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
    // var total_miles=0;//figure out if needed???
    //new user
    // if($scope.userRecord.last_end==undefined){
    //   total_miles=input_miles;
    //   $scope.newUserPost(total_miles);
    //   $scope.total_record=total_miles;
    //   //update panel's progress bar
    //   $(".determinate").attr("style", "width:"+total_miles/27+"%");
      
    //   //update map
    //   var after_round_miles=(Math.round(total_miles*2))/2;
    //   var mapInfo=$scope.userRecord.mapPick;
    //   $scope.translateIntoCoor(mapInfo,after_round_miles).then(function(end){
    //     initMap(end);
    //   });
    // }else{


    //update old user
    $scope.getLastEnd().then(function(response){
    
      var last_end_miles=response.last_end;

      total_miles=input_miles+last_end_miles;
      //update firebase
      $scope.updateRecord(total_miles);
      $scope.total_record=total_miles;
      //update panel's progress bar
      $(".determinate").attr("style", "width:"+total_miles/27+"%");
      
      //update map
      var after_round_miles=(Math.round(total_miles*2))/2;
      var mapInfo=$scope.userRecord.mapPick;
      $scope.translateIntoCoor(mapInfo,after_round_miles).then(function(end){
        initMap(end);

      //meet milestone pop up
      $scope.milestonePopUp(mapInfo,last_end_miles,total_miles);
      });
       
    })
    // }
  };


  /*************************************
        Functions, from itemFactory.js
  *************************************/

  //translate into coordinate
  $scope.translateIntoCoor=function(mapInfo,input_miles){
    return new Promise(function(resolve,reject){
      itemStorage.translateIntoCoor(mapInfo,input_miles).then(function(response){
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
      })
    })
  }


  //Update firebase last_end
  $scope.updateRecord=function(total_miles){
    var id=$scope.userRecord.id;
    var mapInfo=$scope.userRecord.mapPick;
    // console.log($scope.userRecord);
    itemStorage.updateMapRecord(mapInfo,total_miles,id).then(function(response){
    })
  };

  //new user miles post
  $scope.newUserPost=function(total_miles){
    itemStorage.newUserPost(total_miles).then(function(response){
    });
  };

  //test milestone pop up
  $scope.milestonePopUp=function(mapInfo,last_end_miles,total_miles){
    itemStorage.getMilestone(mapInfo).then(function(response){
      for(var i=0;i<response.length;i++){
        if((response[i].mile<=total_miles)&(response[i].mile>last_end_miles)){
        //pop up milestone resort, close after 2secs
        setTimeout(function(){$('#modal1').openModal();},1000);
        $('#modalImage').attr("src",response[i].pic);
        $('#modalHeader').html("You passed: "+response[i].title);
        
        setTimeout(function(){$('#modal1').closeModal();},4000);
        }
      }
        
    })
  }

  // $scope.toggleStreetView=function(){
  //   var toggle = panorama.getVisible();
  //   if (toggle == false) {
  //     panorama.setVisible(true);
  //   } else {
  //     panorama.setVisible(false);
  //   }
  // };

})





