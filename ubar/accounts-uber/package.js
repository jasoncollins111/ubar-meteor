Package.describe({
  summary: "Accounts service for uber"
});

Package.on_use(function (api) {
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use('uber-oauth', ['client', 'server']);

  api.add_files(['uber_login_button.css'], 'client');

  api.add_files('uber.js', ['client', 'server']);
});

