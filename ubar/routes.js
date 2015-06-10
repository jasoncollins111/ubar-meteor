Router.configure({
   layoutTemplate: 'layout'  //can be any template name
 });

// Router.route('/login', function () {
//     if (!Meteor.user() && !Meteor.loggingIn()) {
//         this.route('/login');
//     } else if(Meteor.user()) {
//         // required by Iron to process the route handler
//         this.route('/callback')
//     }
// }); 

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
    // this.route('callback', {
  //   path: '_oauth/uber?close'
  // })
  // this.route('login', {

  //   path: 'login'
  // });


});

// Router.onBeforeAction(function () {
//     if (!Meteor.user() && !Meteor.loggingIn()) {
//         this.redirect('/login');
//     } else {
//         // required by Iron to process the route handler
//         this.redirect('/callback')
//     }
// }, {
//     except: ['login']
// });
