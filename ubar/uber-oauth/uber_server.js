UberOauth = {};

OAuth.registerService('uber', 2, null, function(query) {

  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  var identity = getIdentity(accessToken);

  var serviceData = {
    id: identity.first_name,
    accessToken: accessToken,
    expiresAt: (+new Date()) + (1000 * response.expiresIn)
  };

  // include all fields from dropbox
  // https://www.dropbox.com/developers/core/docs#account-info
  var fields = _.pick(identity, ['first_name', 'last_name']);

  return {
    serviceData: serviceData,
    options: {
      profile: fields
    }
  };
});

// checks whether a string parses as JSON
var isJSON = function (str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'uber'});
    console.log(config)

  if (!config)
    throw new ServiceConfiguration.ConfigError("Service not configured");

  var responseContent;
  try {
    // Request an access token
    responseContent = Meteor.http.post(
      "https://login.uber.com/oauth/token", {
        auth: [config.client_id, config.client_secret].join(':'),
        params: {
          grant_type: 'authorization_code',
          code: query.code,
          redirect_uri: config.redirect_uri
        }
      }).content;
  } catch (err) {
    throw new Error("Failed to complete OAuth handshake with uber. " + err.message);
  }

  // If 'responseContent' does not parse as JSON, it is an error.
  if (!isJSON(responseContent)) {
    throw new Error("Failed to complete OAuth handshake with uber. " + responseContent);
  }

  // Success! Extract access token and expiration
  var parsedResponse = JSON.parse(responseContent);
  var accessToken = parsedResponse.access_token;
  var expiresIn = parsedResponse.expires_in;

  if (!accessToken) {
    throw new Error("Failed to complete OAuth handshake with uber " +
      "-- can't find access token in HTTP response. " + responseContent);
  }

  return {
    accessToken: accessToken,
    expiresIn: expiresIn
  };
};

var getIdentity = function (accessToken) {
  try {
    return Meteor.http.get("https://api.uber.com/v1/me", {
        headers: { Authorization: 'Bearer ' + accessToken }
    }).data;
  } catch (err) {
    throw new Error("Failed to fetch identity from dropbox. " + err.message);
  }
};

UberOauth.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
