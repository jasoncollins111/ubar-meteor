Markers = new Mongo.Collection('markers');

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
          zoom: 17,

        };
      }
    }
  });

  Template.map.onCreated(function() {  
    GoogleMaps.ready('map', function(map) {
      google.maps.event.addListener(map.instance, 'click', function(event) {
        var lat = event.latLng.lat()
        var lng = event.latLng.lng()
        var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(lat, lng),
          map: map.instance,
          // We store the document _id on the marker in order 
          // to update the document within the 'dragend' event below.
        
        });

        // This listener lets us drag markers on the map and update their corresponding document.
        // google.maps.event.addListener(marker, 'dragend', function(event) {
        //   // Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
        //   console.log('dragging')
        // });   
      });
    }); 
  }); 
  Template.home.events({
    // var user = Meteor.users.find().fetch();
    // var thisUser = user[0].profile;
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
    'click #profile': function(event) {
        var user = Meteor.users.find().fetch();
        accessToken = user[0].services.uber.accessToken      
        console.log(accessToken)
        Meteor.call('getAuthorizedRequest', '/v1/me', accessToken, function(err, res){
          if (err) {
              throw new Meteor.Error("errorrz");
          } else{
            console.log(res)
            var pic = res.picture
            Session.set('picture', pic)   
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

if (Meteor.isServer) {
  Meteor.startup(function () {

    ServiceConfiguration.configurations.remove({
    service: 'uber'
    }); 
    
    ServiceConfiguration.configurations.insert({
      service : "uber", 
      client_id : "QUcKJJhnZIlkYM4_bnCkK5FbXbPrpELz", 
      client_secret : "IQ5FBDEdScBuHgIreXuYUd6rbvWHYiRVnrRsObEQ", 
      server_token : "GsbyGzKLvuFY_5HKnDRwQ1X-qI0ZovFd6UV21Ate", 
      redirect_uri : "http://localhost:3000/_oauth/uber?close" 
    })
  })
  Meteor.methods({
 
    getAuthorizedRequest: function(endpoint, accessToken, callback) {
      var params = {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      }
      var response = Meteor.http.call('GET', 'https://sandbox-api.uber.com'+endpoint, params).data
      console.log(response)
      return response
    },
    postAuthorizedRequest: function(endpoint, accessToken, parameters, callback) {
      this.unblock()
      var params = {
        data: parameters,

        headers: {
          Authorization: "Bearer " + accessToken,
          'Content-Type': 'application/json'
        }
      }
      var response = HTTP.post('https://sandbox-api.uber.com'+endpoint, params).data
      console.log("response is:",response)
      return response
    }
  });
  console.log('server up!')
}

