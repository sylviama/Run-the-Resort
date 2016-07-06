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


  var translateIntoCoor=function(input_miles,mapPick){
    return $q(function(resolve,reject){
      $http.get("data/dictionary.json")
        .success(function(response){
          var key_mile=Object.keys(response.yellowstone);

          for(i=0;i<key_mile.length;i++){
            if(key_mile[i]==input_miles){
              var end={};
              end.lat=response.yellowstone[key_mile[i]].lat;
              end.lng=response.yellowstone[key_mile[i]].lng;
              resolve(end);
            };
          }
        })
        .error(function(error){
          reject(error);
        })
    })
  }

  //get milestone
  var getMilestone=function(mapPick){
    
    return $q(function(resolve,reject){
      $http.get("data/milestone.json")
      .success(function(response){
        var milestoneArray=[];
        for(var i=0;i<response.milestones.yellowstone.length;i++){
          // console.log(response.milestones.yellowstone[i].lat);
          var obj={};
          obj.lat=response.milestones.yellowstone[i].lat;
          obj.lng=response.milestones.yellowstone[i].lng;
          obj.mile=response.milestones.yellowstone[i].mile;
          obj.pic=response.milestones.yellowstone[i].pic;
          obj.title=response.milestones.yellowstone[i].title;
          milestoneArray.push(obj); 
        }
        resolve(milestoneArray);
      })
      .error(function(error){
        reject(error);
      })
    })
  }

  


return {getLastEnd:getLastEnd, newUserPost:newUserPost, translateIntoCoor:translateIntoCoor, getMilestone:getMilestone, updateMapRecord:updateMapRecord}

})