steal('can',
	  './init.mustache',
	  './_twitter_modal.mustache',
	  function(can, initView, twitterModal) {
		  return can.Control(
			  {
				  defaults : {}
			  }, {
				  init : function( elem, opts ){
					  this.element.html( initView({}) );

					  $('#login-modal').on('show', function( ev ) {
						  var user = opts.currentUser;

						  // prevent when user is logged in
						  if( user.loggedIn() || user.loggingIn() ) {
							  ev.preventDefault();
						  }
					  });
				  },

				  '{currentUser} authStatus': function(user, ev, newVal, oldVal) {
					  // will execute only fetching non logged user's session (oldVal = undefined, newVal = false) 
					  !newVal && !oldVal && can.route.attr('login') && this.showLogin();
				  },

				  '#login-modal .providers .twitter a click': function( el, ev ) {					  
					  ev.preventDefault();
					  el.closest('.modal').modal('hide');
					  this.options.currentUser.login('twitter');
				  },
				  
				  '#login-modal .providers .github a click': function( el, ev ) {
					  ev.preventDefault();
					  el.closest('.modal').modal('hide');
					  this.options.currentUser.login('github');
				  },

				  '#login-modal .providers .meetup a click': function( el, ev ) {
					  ev.preventDefault();
					  el.closest('.modal').modal('hide');
					  this.options.currentUser.login('meetup');
				  },

				  showLogin: function () {
					  this.element.find('#login-modal').modal('show');
				  },

				  showTwitter: function() {
					  // twitter buttons are loaded dynamically
					  $('#twitterModal').length || this.element.append( twitterModal({}) );
					  $('#twitterModal').modal('show');
				  }
			  });
	  });
