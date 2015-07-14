Accounts.oauth.registerService('uber');

if (Meteor.isClient) {
    Meteor.loginWithUber = function(options, callback) {
        // support a callback without options
        if (!callback && typeof options === "function") {
            callback = options;
            options = null;
        }

        var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
        UberOauth.requestCredential(options, credentialRequestCompleteCallback);
    };
} else {
    Accounts.addAutopublishFields({
      forLoggedInUser: ['services.uber'],
      forOtherUsers: ['services.uber.id']
    });
}
