UberOauth = {};

// Request dropbox credentials for the user
// @param options {optional}
// @param callback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
UberOauth.requestCredential = function (options, callback) {
  // support both (options, callback) and (callback).
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'uber'});
  if (!config) {
    callback && callback(new ServiceConfiguration.ConfigError("Service not configured"));
    return;
  }
  console.log('client',config)
  var state = Random.id();

  var scope = [];
  // if (options && options.requestPermissions) {
  //     scope = options.requestPermissions.join(',');
  // }
  var url = Meteor.absoluteUrl('_oauth/uber?close')
  console.log('url:', url)
  console.log(encodeURIComponent(config.redirect_uri))
  var loginUrl =
      'https://login.uber.com/oauth/authorize?' +
      'client_id=' + config.client_id + '&response_type=code' + '&state=' + state +
      '&redirect_uri=' + encodeURIComponent(config.redirect_uri)+'&scope=profile+products+request';
       // + '&scope=' + scope
// encodeURIComponent(Meteor.absoluteUrl('_oauth/uber?close'))
  OAuth.initiateLogin(state, loginUrl, callback, {width: 875, height: 400});
};
