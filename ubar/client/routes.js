Router.configure({
   layoutTemplate: 'layout'  //can be any template name
 });


Router.map(function () {
  this.route('home', {
    path: '/',
      onBeforeAction: function () {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
      }
      else{
        Router.go('home');
        // this.next();
      }
    }
    this.next()
  }
  });
});

