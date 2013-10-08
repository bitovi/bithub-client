steal(
	'can',
	'./activities.mustache',
	function(can, activitiesView){

		var parse10 = function(str) { return parseInt(str, 10) };

		var whitelistedTypes = ['author','award'];

		var calcPoints = function( event ) {
			var sum = parse10( event.attr('value') );
			
			if( event.attr('upvotes') ) sum += parse10( event.attr('upvotes') );

			return sum;			
		}
		
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
							return _.contains(whitelistedTypes, this.attr('type')) && calcPoints(this) ? opts.fn(this) : opts.inverse(this);
						},
						calcPoints: function() {
							var sum = calcPoints( this );
							
							if( sum > 0 ) {
								return '+' + sum;
							} else if( sum < 0 ) {
								return '-' + sum;
							} else {
								return '0';
							}
						},
						eventUrl: function() {
							var id;

							if( this.attr('type') == 'author' ) {
								id = this.attr('id');
							} else if( this.attr('type') == 'award' ) {
								id = this.attr('event_id');
							}
							
							return id ? can.route.url({page: 'eventdetails', id: id}) : 'javascript://';
						}
					},
					partials: {}
				}));
			}
		});
	}
);
