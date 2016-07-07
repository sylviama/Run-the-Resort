app.factory("itemStorage", function($q, $http,authFactory){

  var getLastEnd=function(){
    var userRecord={};
    var user=authFactory.getUser();
    
    return $q(function(resolve,reject){
      $http.get(`https://runtheresortsylvia.firebaseio.com/userRecords.json?orderBy="uid"&equalTo="${user.uid}"`)
          .success(function(response){

            Object.keys(response).forEach(function(key){
                response[key].id=key;
                userRecord=response[key];
            });
            resolve(userRecord);
          }).error(function(error){
            reject(error);
          });
    })
  };

  // var updateRecord=function(total_miles,id){
  //   var user=authFactory.getUser();
  //   return $q(function(resolve,reject){
  //     $http.put("https://runtheresortsylvia.firebaseio.com/userRecords/"+id+".json",
  //     JSON.stringify({
  //       last_end: total_miles,
  //       mapPick:"",
  //       uid:user.uid
  //     })
  //     ).success(function(response){
  //       resolve(response)
  //     }).error(function(error){
  //       reject(error);
  //     })
  //   }) 
  // };

  var updateMapRecord=function(mapInfo,mile,id){
    var user=authFactory.getUser();
    return $q(function(resolve,reject){
      $http.put("https://runtheresortsylvia.firebaseio.com/userRecords/"+id+".json",
      JSON.stringify({
        mapPick: mapInfo,
        last_end:mile,
        uid:user.uid
      })
      ).success(function(response){
        resolve(response)
      }).error(function(error){
        reject(error);
      })
    }) 
  };


  var newUserPost=function(total_miles){
    var user=authFactory.getUser();
    return $q(function(resolve,reject){
      $http.post("https://runtheresortsylvia.firebaseio.com/userRecords/.json",
        JSON.stringify({
          last_end:total_miles,
          mapPick:"",
          uid:user.uid
        }))
      .success(function(response){
        resolve(response);
      })
      .error(function(error){
        reject(error);
      })
    })
  };


  var translateIntoCoor=function(mapInfo,input_miles){
    return $q(function(resolve,reject){
      $http.get("data/dictionary.json")
        .success(function(response){
          //test which map
          // var key_mile;
          if(mapInfo==="yellowstone"){
            var key_mile=Object.keys(response.yellowstone);
            for(i=0;i<key_mile.length;i++){
            if(key_mile[i]==input_miles){
              var end={};
              end.lat=response.yellowstone[key_mile[i]].lat;
              end.lng=response.yellowstone[key_mile[i]].lng;
              resolve(end);
            };
          }
          }else if(mapInfo==="grandCanyon"){
            var key_mile=Object.keys(response.grandcanyon);
            for(i=0;i<key_mile.length;i++){
            if(key_mile[i]==input_miles){
              var end={};
              end.lat=response.grandcanyon[key_mile[i]].lat;
              end.lng=response.grandcanyon[key_mile[i]].lng;
              resolve(end);
            };
          }
          }
          
          
        })
        .error(function(error){
          reject(error);
        })
    })
  }

  //get milestone
  var getMilestone=function(mapInfo){
    
    return $q(function(resolve,reject){
      $http.get("data/milestone.json")
      .success(function(response){

        if(mapInfo==="yellowstone"){
          var milestoneArray=[];
          for(var i=0;i<response.yellowstone.length;i++){
            var obj={};
            obj.lat=response.yellowstone[i].lat;
            obj.lng=response.yellowstone[i].lng;
            obj.mile=response.yellowstone[i].mile;
            obj.pic=response.yellowstone[i].pic;
            obj.title=response.yellowstone[i].title;
            milestoneArray.push(obj); 
          };
        resolve(milestoneArray);
        }else if(mapInfo==="grandCanyon"){

        var milestoneArray=[];
        for(var i=0;i<response.grandcanyon.length;i++){
          var obj={};
          obj.lat=response.grandcanyon[i].lat;
          obj.lng=response.grandcanyon[i].lng;
          obj.mile=response.grandcanyon[i].mile;
          obj.pic=response.grandcanyon[i].pic;
          obj.title=response.grandcanyon[i].title;
          milestoneArray.push(obj); 
        }
        resolve(milestoneArray);
        };
      })
      .error(function(error){
        reject(error);
      })
    })
  }

  


return {getLastEnd:getLastEnd, newUserPost:newUserPost, translateIntoCoor:translateIntoCoor, getMilestone:getMilestone, updateMapRecord:updateMapRecord}

})