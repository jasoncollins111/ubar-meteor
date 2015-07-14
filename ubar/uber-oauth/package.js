Package.describe({
  summary: "Login service for uber accounts"
});

Package.on_use(function(api) {
  api.use('oauth', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('templating', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('UberOauth');

  api.add_files( ['uber_configure.html', 'uber_configure.js'], 'client');

  api.add_files('uber_server.js', 'server');
  api.add_files('uber_client.js', 'client');
});
