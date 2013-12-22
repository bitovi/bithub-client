steal(
	'can',
	'./login.mustache',
	function(can, initView) {

		return can.Control({
			defaults: {}
		},{
			init: function (element, opts) {

				element.html(initView({
					user: opts.currentUser,
					routes: {
						earnpoints: can.route.url({page: 'earnpoints'}, false),
						rewards: can.route.url({page: 'rewards'}, false),
						activities: can.route.url({page: 'profile', view: 'activities'}, false),
						profile: can.route.url({page: 'profile', view: 'info'}, false),
						admin: can.route.url({page: 'admin'}, false)
					}
				}, {
					postBtnActive: function() {
						return opts.newpostVisibility() ? "active" : "";
					}
				}));
			},

			'#login-github-link click': function( el, ev ) {
				ev.preventDefault();

				var user = this.options.currentUser;
				user.attr('authStatus', 'loggingIn');
				user.login('github');
			},

			'#login-twitter-link click': function( el, ev ) {				
				ev.preventDefault();
				
				var user = this.options.currentUser;
				user.attr('authStatus', 'loggingIn');
				user.login('twitter');
			},

			'#show-newpost-form-btn click': function( el, ev ) {
				this.options.newpostVisibility( !this.options.newpostVisibility() );
			},

			'#logout-btn click': function( el, ev ) {
				this.options.currentUser.logout();
			}
		});
	}
);
