steal(
	'can',
	'./init.mustache!',
	function(can, initView){
		return can.Control({
			defaults : {
				routes: {
					info: function () { return can.route.url({page: 'profile', view: 'info'}, false) },
					activities: function () { return can.route.url({page: 'profile', view: 'activities'}, false) },
					rewards: function () { return can.route.url({page: 'rewards'}, false) },
					earnpoints: function () { return can.route.url({page: 'earnpoints'}, false) }
				}}
		}, {
			init : function( elem, opts ){
				var self = this;
				
				elem.html( initView({
					routes: this.options.routes,
					user: this.options.currentUser
				}, {
					helpers: {
						isShown: function( opts ) {
							if( self.options.currentUser.isLoggedIn() && self.isRoute() ) {
								return opts.fn(this);
							} else {
								return opts.inverse(this);
							}
						},
						isActive: function( routeUrl, opts ) {
							can.route.attr('view'); // triggers on 'view' change?!
							return routeUrl().replace(/^\//, '') == can.route.attr()['route'] ? "active" : "";
						}
					}
				}) );
				
			},

			isRoute: function() {
				var currRoute = can.route.attr()['route'],
					routes = this.options.routes;

				for( var key in routes ) {
					if( routes[key]().replace(/^\//, '') == currRoute ) {
						return currRoute;
					}
				}
			}
		});
		
	});
