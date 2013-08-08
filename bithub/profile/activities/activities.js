steal(
	'can',
	'./activities.mustache',
	'../_navbar.mustache',
	function(can, activitiesView, NavbarPartial){
		
		return can.Control.extend({
			pluginName: 'profile-activities',
			defaults : {}
		}, {
			init : function(element, options){

				element.html(activitiesView({
					routes: options.subpageRoutes,
					user: options.currentUser
				}, {
					helpers: {
						getPoints: function (opts) {
							var value = this.value || this.authorship_value;
							if (value > 0) {
								return "+" + value;
							} else if ( value == 0 ) {
								return value;
							} else {
								return "-" + value;
							}
						}
					},
					partials: {
						navbarPartial: NavbarPartial
					}
				}));
			}
		});
	}
);
