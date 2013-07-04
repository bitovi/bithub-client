steal(
	'can',
	'./init.mustache',
	function(can, initView) {

		return can.Control({
			defaults: {
				loggedInDelayed: can.compute()
			}
		},{
			init: function( element, opts ) {

				element.html(initView({
					user: opts.currentUser,
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
