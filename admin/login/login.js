steal(
	function () {
		return {
			connect: function(options) {
				var self = this;
				var windowPropsStr = options.windowPropsStr ? options.windowPropsStr : "width=600,height=300,scrollbars=yes";
				var title = options.title ? options.title : "Oauth login";
				var url = '/api/auth/' + options.feed + '_brand';

				oauthWindow = window.open(url, title, windowPropsStr);
				oauthWindowSweeper = window.setInterval(function() {
					if (oauthWindow.closed) {
						window.clearInterval(oauthWindowSweeper);
						self.fromSession();
					}
				}, 500);
			}
		};
	});
