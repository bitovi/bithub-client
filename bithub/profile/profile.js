steal(
	'can',
	'bithub/profile/info',
	'bithub/profile/activities',
	function(can, ProfileInfoControl, ProfileActivitiesControl){

		return can.Control.extend({
			pluginName: 'profile',
			defaults : {
				views: {
					info: ProfileInfoControl,
					activities: ProfileActivitiesControl
				},
				subpageRoutes: {
					info: can.route.url({page: 'profile', view: 'info'}, false),
					activities: can.route.url({page: 'profile', view: 'activities'}, false)
				}
			}
		}, {
			init : function (elem, opts) {
				this.initView(can.route.attr('view'), opts);
			},

			'{can.route} change' : function (fn, ev, newVal, oldVal) {
				this.initView(newVal);
			},
			
			'{currentUser} loggedIn' : function (fn, ev, newVal, oldVal) {
				if (newVal == false) can.route.attr({'page': 'homepage', 'view': 'latest'});
			},

			initView : function (currentView) {
				console.log(currentView);
				var control = this.options.views[currentView],
					$div = $('<div/>');

				new control($div, this.options);
				this.element.html($div);
			}

		});
	}
);
