app.controller("pickMapCtrl",function($scope,$location,itemStorage){

  /**************************************
  initial: get user record and capture id and last end miles
  ***************************************/
  $scope.getLastEnd=function(){
    $scope.userRecord={};
    return new Promise(function(resolve,reject){
      itemStorage.getLastEnd().then(function(response){
        $scope.userRecord=response;
        resolve($scope.userRecord);
      })
    })
  }
  

  //update map record
  $scope.updateMapRecord=function(mapPick,mile,id){
    itemStorage.updateMapRecord(mapPick,mile,id).then(function(response){
    })
  };

  $scope.newUserPost=function(mapPick){
    var mile=0;
    itemStorage.newUserPost(mapPick,mile).then(function(response){
    })
  }


  /**************************************
            button functions
  ***************************************/
  $scope.confirmMap=function(){
    $location.url("/record");
  };


  $scope.selectYellowstone=function(){
    console.log("picked yellowstone card");
    $("#grandCanyonCard").attr("class", "card card-size-for-map z-depth-3 hoverable");
    $("#yellowstoneCard").attr("class", "clicked card card-size-for-map z-depth-3 hoverable");
    
    //update user picked map record
    $scope.getLastEnd().then(function(response){
      if(response.id===undefined){
        $scope.newUserPost("yellowstone");
        console.log("new user");
      }else{
        var id=response.id;
        var mile=response.last_end;
        var mapPick="yellowstone"; 
        $scope.updateMapRecord(mapPick,mile,id);
        console.log("old user");
      }
    });
    
  };

  $scope.selectGrandCanyon=function(){
    console.log("picked Grand Canyon card");
    $("#yellowstoneCard").attr("class", "card card-size-for-map z-depth-3 hoverable");
    $("#grandCanyonCard").attr("class", "clicked card card-size-for-map z-depth-3 hoverable");
    
    //update user picked map record
    $scope.getLastEnd().then(function(response){
      if(response.id===undefined){
        $scope.newUserPost("grandCanyon");
      }else{
        var id=response.id;
        var mile=response.last_end;
        var mapPick="grandCanyon"; 
        $scope.updateMapRecord(mapPick,mile,id);
      }
    });
  };

})

