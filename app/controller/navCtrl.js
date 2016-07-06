app.controller("navCtrl",function($scope){

  //click and add active
  $("#record").click(function(){
    $scope.clearClass();
    $("#record").attr("class", "active");
  });

  $("#pickMap").click(function(){
    $scope.clearClass();
    $("#pickMap").attr("class", "active");
  });

  $("#visited").click(function(){
    $scope.clearClass();
    $("#visited").attr("class", "active");
  });

  $("#logout").click(function(){
    $scope.clearClass();
  });


  //clear function
  $scope.clearClass=function(){
    $("#record").attr("class","");
    $("#pickMap").attr("class","");
    $("#visited").attr("class","");
  };
})