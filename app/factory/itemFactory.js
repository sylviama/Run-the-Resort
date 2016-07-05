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

  var updateRecord=function(total_miles,id){
    var user=authFactory.getUser();
    // var id=$scope.userRecord.id;
    return $q(function(resolve,reject){
      $http.put("https://runtheresortsylvia.firebaseio.com/userRecords/"+id+".json",
      JSON.stringify({
        last_end: total_miles,
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


  var translateIntoCoor=function(input_miles){
    return $q(function(resolve,reject){
      $http.get("data/dictionary.json")
        .success(function(response){
          var key_mile=Object.keys(response);

          for(i=0;i<key_mile.length;i++){
            if(key_mile[i]==input_miles){
              var end={};
              end.lat=response[key_mile[i]].lat;
              end.lng=response[key_mile[i]].lng;
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
  var getMilestone=function(){
    
    return $q(function(resolve,reject){
      $http.get("data/milestone.json")
      .success(function(response){
        var milestoneArray=[];
        for(var i=0;i<response.milestones.length;i++){
          // console.log(response.milestones[i].lat);
          var obj={};
          obj.lat=response.milestones[i].lat;
          obj.lng=response.milestones[i].lng;
          obj.mile=response.milestones[i].mile;
          obj.pic=response.milestones[i].pic;
          obj.title=response.milestones[i].title;
          milestoneArray.push(obj); 
        }
        resolve(milestoneArray);
      })
      .error(function(error){
        reject(error);
      })
    })
  }

  


return {getLastEnd:getLastEnd, updateRecord:updateRecord, newUserPost:newUserPost, translateIntoCoor:translateIntoCoor, getMilestone:getMilestone}

})