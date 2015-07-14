Template.configureLoginServiceDialogForUber.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForUber.fields = function () {
  return [
    {property: 'client_id',  label: 'Client ID'},
    {property: 'client_secret', label: 'Secret'}
  ];
};
