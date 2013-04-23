steal(
	'can',
	'./init.mustache',
	function(can, initView) {
		return can.Control({
			defaults: {}
		}, {
			init: function () {
				var self = this;
				
				self.element.html(initView({
					loggedIn: self.options.currentUser.attr('loggedIn'),
					currentUser: self.options.currentUser
				}));
			},

			'{currentUser} loggedin': function() {
				var self = this;
				
				self.element.html(initView({
					loggedIn: self.options.currentUser.attr('loggedIn'),
					currentUser: self.options.currentUser
				}));
			},

			'#login-github-link click': function(el, ev) {
				ev.preventDefault();
				this.options.currentUser.login({url: '/api/auth/github' });
			},

			'#login-twitter-link click': function(el, ev) {
				ev.preventDefault();
				this.options.currentUser.login({url: '/api/auth/twitter' });
			}
		});
	});
