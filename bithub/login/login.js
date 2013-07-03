steal(
	'can',
	'./init.mustache',
	function(can, initView) {
		return can.Control({
			defaults: {}
		}, {
			init: function( element, options ) {
				element.html(initView({
					user: options.currentUser,
					routes: {
						'profile': can.route.url({page: 'profile'}, false),
						'activity': can.route.url({page: 'activities'}, false),
						'logout': '/'
					}
				}));
			},

			'#login-github-link click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login('github');
			},

			'#login-twitter-link click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login('twitter');
			},

			'#show-newpost-form-btn click': function( el, ev ) {
				this.options.newpostVisibility( !this.options.newpostVisibility() );
			},

			'#logout-btn click': function( el, ev ) {
				//ev.preventDefault();
				this.options.currentUser.logout();
			}
		});
	});
