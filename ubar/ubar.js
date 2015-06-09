
if (Meteor.isClient) {

  Template.home.events({
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
    }, 
    'click #products': function(event) {
        HTTP.get('https://api.uber.com/v1/products')

        
    }

  });
  
}
// HTTP.get(url, [callOptions], [asyncCallback])

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
 
    // code to run on server at startup
    console.log('server up!')
  });
}

