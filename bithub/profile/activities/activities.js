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

				element.html(activitiesView({
					user: options.currentUser,
					routes: options.routes
				}, {
					helpers: {
						getPoints: function( opts ) {
							var value = this.value || this.authorship_value;
							if (value > 0) { return "+" + value }
							else if ( value == 0 ) { return value }
							else { return "-" + value }
						},
						display: function(opts) {
							return (parse10(this.attr('value') || this.attr('authorship_value')) !== 0) ? opts.fn(this) : opts.inverse(this);
						}
					},
					partials: {}
				}));
			}
		});
	}
);
