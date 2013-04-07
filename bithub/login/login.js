steal(
	'can',
	'./init.mustache',
	'bithub/models/current_user.js',
	function(can, initView, currentUser) {
		return can.Control({
			defaults: {currentUser: currentUser}
		}, {
			init: function () {
				var self = this;
				self.element.html(initView({loggedIn: currentUser.attr('loggedIn'), currentUser: currentUser}));
			},

			'{currentUser} loggedin': function() {
				this.element.html(initView({loggedIn: currentUser.attr('loggedIn'), currentUser: currentUser}));
			},

			'#login-github-link click': function(el, ev) {
				ev.preventDefault();
				currentUser.login({url: '/users/auth/github' });
			},

			'#login-twitter-link click': function(el, ev) {
				ev.preventDefault();
				currentUser.login({url: '/users/auth/twitter' });
			}
		})
	});
