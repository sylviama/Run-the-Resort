"use strict"

app.factory("authFactory", function(){
  let ref=new Firebase("https://runtheresortsylvia.firebaseio.com/");
  let currentUserData=null;

  return{

    isAuthenticated(){
      let authData=ref.getAuth();//getAuth is firebase function
      return(authData)?true:false;
    },

    getUser(){
      return currentUserData;
    },

    authenticate(credentials){
      return new Promise((resolve,reject)=>{
        ref.authWithPassword({
          "email":credentials.email,
          "password":credentials.password
        },(error,authData)=>{
          if(error){
            reject(error);
          }else{
            currentUserData=authData;
            resolve(authData);
          };
        });
      });
    }

  };//close return
});