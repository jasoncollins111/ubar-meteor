if (Meteor.isServer) {
  Meteor.startup(function () {

    ServiceConfiguration.configurations.remove({
    service: 'uber'
    });

    ServiceConfiguration.configurations.insert({
      service : "uber",
      client_id : "config.client_id",
      client_secret : "config.client_secret",
      server_token : "config.server_token",
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
