steal(
	'can',
	'./activities.mustache',
	function(can, activitiesView){
		
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
						getPoints: function (opts) {
							var value = this.value || this.authorship_value;
							if (value > 0) { return "+" + value }
							else if ( value == 0 ) { return value }
							else { return "-" + value }
						}
					},
					partials: {}
				}));
			}
		});
	}
);
