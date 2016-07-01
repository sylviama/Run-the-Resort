"use strict"

var app=angular.module("runningApp",["ngRoute"]);

let isAuth=(authFactory)=> new Promise((resolve,reject)=>{
  if(authFactory.isAuthenticated()){
    console.log("Use is authenticated, resolve route promise");
    resolve();
  }else{
    console.log("Use is not authenticated, reject route promise");
  };
});

app.config(function($routeProvider){
  $routeProvider.
    when("/", {
      templateUrl:'partial/map.html',
      controller:"loginCtrl",
    }).
    when("/logout", {
      templateUrl:'partial/login.html',
      controller:"loginCtrl",
    }).
    when('/record', {
      templateUrl:'partial/map.html',
      controller:"mapCtrl",
      resolve:{isAuth}
    }).
    when('/pickMap', {
      templateUrl:'partial/pickMap.html',
      controller:"pickMapCtrl"
      // resolve:{isAuth}
    }).
    when('/visited', {
      templateUrl:'partial/visited_places.html',
      controller:"visited_placesCtrl",
      resolve:{isAuth}
    }).
    otherwise('/');
});

app.run(($location)=>{
  let todoRef=new Firebase("https://ngtododemo.firebaseio.com/");

  todoRef.onAuth(authData=>{
    if(!authData){
      $location.path("/logout");
    };
  })
})