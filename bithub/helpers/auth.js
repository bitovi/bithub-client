steal(
	function () {
		return {
			login: function(options) {
				var self = this;
				var windowPropsStr = options.windowPropsStr ? options.windowPropsStr : "width=600,height=300";
				var title = options.title ? options.title : "Oauth login";
				var url = options.url ? options.url : '/api/auth/github';

				oauthWindow = window.open(url, title, windowPropsStr);
				oauthWindowSweeper = window.setInterval(function() {
					if (oauthWindow.closed) {
						window.clearInterval(oauthWindowSweeper);
						self.fromSession();
					}
				}, 500);
			},

			logout: function() {
				var self = this, blacklist = ['loggedInDelayed', 'authStatus'];

				$.get('/api/auth/logout', function () {
					setTimeout(function() {
						self.attr('loggedInDelayed', false);
						self.attr('authStatus', 'loggedOut');

						for(var key in self.attr()) {
							if (blacklist.indexOf(key) < 0) self.removeAttr(key);
						}
						
					}, 500);

					// if not on homepage redirect to homepage latest
					if( can.route.attr('page') != 'homepage' ) {
						can.route.attr({
							page:'homepage',
							view: 'latest'
						});
					}
				});
			}
		};
	});
