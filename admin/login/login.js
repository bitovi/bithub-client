steal('can/util/string', 'can/compute',
	function (can) {

		window.CONNECTING_FEED = can.compute("");

		return {
			connect: function(options) {
				var windowPropsStr = options.windowPropsStr ? options.windowPropsStr : "width=600,height=300,scrollbars=yes";
				var title = options.title ? options.title : "Oauth login";
				var host = window.location.host.split('.');
				var url = can.sub('http://{host}/api/login_and_oauth?oauth_acc={acc}&brand={brand}', {
					host: host.splice(1, host.length - 1).join('.'),
					brand: options.feed,
					acc:BRAND.attr('acc')
				})

				console.log(url)

				CONNECTING_FEED(options.feed);

				var oauthWindow = window.open(url, title, windowPropsStr);
				var oauthWindowSweeper = window.setInterval(function() {
					if (oauthWindow.closed) {
						CONNECTING_FEED("");
						window.BRAND.reload();
						window.clearInterval(oauthWindowSweeper);
					}
				}, 100);
			}
		};
	});
