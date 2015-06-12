if (Meteor.isClient) {
  
  Template.home.helpers({
    location: function() {
      var location = Geolocation.currentLocation()
      var latitude = location.coords.latitude.toFixed(4)
      var longitude = location.coords.longitude.toFixed(4)
      Session.set('latitude', latitude)
      Session.set('longitude', longitude)
      GoogleMaps.load({key: 'AIzaSyCtNUFOJI2JKSkUr20zDjhst0Ko8xSruP8'});
      // var local = 
      console.log()
      return latitude +' '+longitude
    },
    name: function() {
      var user = Meteor.users.find().fetch();
      var firstName = user[0].profile.first_name
      var lastName = user[0].profile.last_name
      return firstName + " " + lastName
    },
    eta: function(){
      var timeOfArrival = Session.get('eta')
      return timeOfArrival
    }
  })

  Template.map.helpers({  
    mapOptions: function() {
      var lat = Session.get('latitude')
      var lon = Session.get('longitude')
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(lat, lon),
          zoom: 17
        };
      } 
    }
  });

  Template.map.onCreated(function() {  
    GoogleMaps.ready('map', function(map) {
        var lat = Session.get('latitude')
        var lng = Session.get('longitude')
        var marker = new google.maps.Marker({
          // draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(lat, lng),
          map: map.instance
        });   
    }); 
  }); 
  Template.home.events({
    'click #uber-login': function(event) {
        Meteor.loginWithUber(function(err){
            if (err) {
                throw new Meteor.Error("Uber login failed");
            } else{
              var user = Meteor.users.find().fetch();
              var thisUser = user[0].profile;
              console.log(thisUser)
            }
        });
    },
 
    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    },
    'click #request': function() {
      var user = Meteor.users.find().fetch();
      var accessToken = user[0].services.uber.accessToken 
      var latitude = Session.get('latitude')
      var longitude = Session.get('longitude')
      
      var params = {
        start_latitude: latitude,
        start_longitude: longitude,
        product_id: "a1111c8c-c720-46c3-8534-2fcdd730040d"
      }

      Meteor.call('postAuthorizedRequest', '/v1/requests', accessToken, params,  function(err, res){
        if (err) {
          throw new Meteor.Error('request failed here', err)
        } else{
          console.log("request results:",res)
          Session.set('eta', res.eta)
        }
      })
    }
  })
}
