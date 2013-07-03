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
				//console.log(" logout " );
				//window.location('/api/auth/logout');
			}
		};
	});
