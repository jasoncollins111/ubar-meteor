
if (Meteor.isClient) {
  Template.home.helpers({
    location: function() {
      var location = Geolocation.currentLocation()
      var latitude = location.coords.latitude
      var longitude = location.coords.longitude
      // var local = 
      console.log()
      return latitude +' '+longitude
    },
    name: function() {
      var user = Meteor.users.find().fetch();
      var firstName = user[0].profile.first_name
      var lastName = user[0].profile.last_name
      return firstName + " " + lastName
      // return Session.get('name');
    }
  }) 

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
              Session.set('name', thisUser.first_name + ' ' + thisUser.last_name)
              // Router.go('map')
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
                throw new Meteor.Error("Logout failed");
            } else{
              console.log(res)
              var pic = res.picture
              // var picture = []
              // picture.push(pic)
              Session.set('picture', pic)
             
            }
        })
    }
  })
}
// HTTP.get(url, [callOptions], [asyncCallback])

if (Meteor.isServer) {
  // var accessToken = Meteor.users
  // console.log(accessToken)
  // console.log(accessToken)
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
    }
  })
    // code to run on server at startup
    console.log('server up!')
  });
}

