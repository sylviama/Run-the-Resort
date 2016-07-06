app.controller("pickMapCtrl",function($scope,$location){
  $scope.confirmMap=function(){
    $location.url("/record");
  };

  // $scope.cancelChangeMap=function(){
  //   $location.url("/record");
  // };

  $scope.selectShowBorder=function(){
    console.log("picked yellowstone card");
    $("#yellowstoneCard").attr("class", "clicked card card-size-for-map z-depth-3 hoverable");
  };
})