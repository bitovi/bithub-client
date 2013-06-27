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
					profileRoute: can.route.url({page: 'profile'}, false),
					activityListRoute: can.route.url({page: 'activities'}, false)
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

			'#show-newpost-form-btn click': function( el, ev) {
				this.options.newpostVisibility( !this.options.newpostVisibility() );
			}
		});
	});
