app.controller("visited_placesCtrl", function($scope, $http, authFactory, itemStorage){

  $scope.visitedArray=[];
  $scope.visited_record=function(){

    itemStorage.getLastEnd().then(function(response){
      var last_mile_record=response.last_end;
      itemStorage.getMilestone().then(function(milestone){
        console.log(milestone);
        for(var i=0;i<milestone.length;i++){
          if(milestone[i].mile<=last_mile_record){
            $scope.visitedArray.push(milestone[i]);
          }
        }
      })

    })
  };
  $scope.visited_record();
});
