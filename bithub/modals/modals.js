steal('can',
	  './init.mustache',
	  './_twitter_modal.mustache',
	  function(can, initView, twitterModal) {
		  return can.Control(
			  {
				  defaults : {}
			  }, {
				  init : function(){
					  this.element.html( initView({}) );
				  },

				  '{currentUser} isLoggedIn': function(user, ev, newVal, oldVal) {
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
