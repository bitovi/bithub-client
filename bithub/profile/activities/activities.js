steal(
	'can',
	'./activities.mustache',
	function(can, activitiesView){

		var parse10 = function(str) { return parseInt(str, 10) };
		
		return can.Control.extend({
			pluginName: 'profile-activities',
			defaults : {}
		}, {
			init : function(element, options){
				var user = options.currentUser,
					routes = options.routes;
				
				// refresh user session to get fresh activities list
				user.refreshSession();
				
				element.html(activitiesView({
					user: user,
					routes: routes
				}, {
					helpers: {
						display: function(opts) {
							return (parse10(this.attr('value') || this.attr('authorship_value')) !== 0) ? opts.fn(this) : opts.inverse(this);
						},
						calcPoints: function() {
							var sum = parse10( this.attr('value') );

							if( this.attr('upvotes') ) sum += parse10( this.attr('upvotes') );

							if( sum > 0 ) {
								return '+' + sum;
							} else if( sum < 0 ) {
								return '-' + sum;
							} else {
								return '0';
							}
						},
						eventUrl: function() {
							return can.route.url({page: 'eventdetails', id: this.attr('id')});
						}
					},
					partials: {}
				}));
			}
		});
	}
);
