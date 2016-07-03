"use strict"

app.controller("loginCtrl",function($scope, authFactory, $location){
  let ref=new Firebase("https://runtheresortsylvia.firebaseio.com/");
  
  $scope.hasUser=false;



  $scope.account={
    email:"",
    password:""
  };

  //check if logout
  if($location.path()==='/logout'){
    ref.unauth();//firebase thing
  }


  $scope.register=()=>{
    
    ref.createUser({
      email:$scope.account.email,
      password:$scope.account.password
      //firebase thing:first thing is the error message, second is success function
    },(error, userData)=>{
      if(error){
        console.log(`Error creating user: ${error}`);
      }else{
        console.log(`Created user account with uid:${userData.uid}`);
        //login part, except url is /pickMap
        authFactory.authenticate($scope.account)
        .then(()=>{
          $scope.hasUser=true;
          $scope.userRecord={};
          $location.url("/pickMap");
          $scope.$apply();//firebase, make it work...
        });
      };
    })
  };

  $scope.login=()=>{
    console.log("You clicked login");
    authFactory.authenticate($scope.account)
    .then(()=>{
      $scope.hasUser=true;
      $scope.userRecord={};
      $location.path("/record");
      $scope.$apply();//firebase, make it work...
    })
  };


})
