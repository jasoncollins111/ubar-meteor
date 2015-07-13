if (Meteor.isServer) {
  Meteor.startup(function () {

    ServiceConfiguration.configurations.remove({
    service: 'uber'
    });

    ServiceConfiguration.configurations.insert({
      service : "uber",
      client_id : "YOUR UBER CLIENT ID",
      client_secret : "YOUR UBER CLIENT SECRET",
      server_token : "YOUR UBER SERVER TOKEN",
      redirect_uri : "http://localhost:3000/_oauth/uber?close"

    })
  })
  Meteor.methods({

    getAuthorizedRequest: function(endpoint, accessToken, callback) {
     //FILL OUT GET REQUEST TO UBER API
    },
    postAuthorizedRequest: function(endpoint, accessToken, parameters, callback) {
      //FILL OUT POST REQUEST TO UBER API
  });
  console.log('server up!')
}
