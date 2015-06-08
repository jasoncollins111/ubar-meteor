
if (Meteor.isClient) {

  Template.login.events({
    'click #uber-login': function(event) {
        Meteor.loginWithUber(function(err){
            if (err) {
                throw new Meteor.Error("Uber login failed");
            }
        });
    },
 
    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
  });
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
      redirect_uri : "http://localhost:3000/auth/uber/callback" 
    })
    // code to run on server at startup
    console.log('server up!')
  });
}

