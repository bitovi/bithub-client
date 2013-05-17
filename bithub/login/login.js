steal(
	'can',
	'./init.mustache',
	function(can, initView) {
		return can.Control({
			defaults: {}
		}, {
			init: function( element, options ) {
				element.html(initView({
					user: options.currentUser
				}));
			},

			'#login-github-link click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login({url: '/api/auth/github' });
			},

			'#login-twitter-link click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login({url: '/api/auth/twitter' });
			},

			'#show-newpost-form-btn click': function( el, ev) {
				this.options.newpostVisibility( !this.options.newpostVisibility() );
			}
		});
	});
