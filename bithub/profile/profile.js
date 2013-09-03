steal(
	'can',
	'./init.mustache',
	'bithub/profile/info',
	'bithub/profile/activities',
	'bithub/profile/earnpoints',
	function(can, initView, ProfileInfoControl, ProfileActivitiesControl, EarnPointsControl){

		var currentControl;
		
		return can.Control.extend({
			pluginName: 'profile',
			defaults : {
				views: {
					info: ProfileInfoControl,
					activities: ProfileActivitiesControl,
					earnpoints: EarnPointsControl
				},
				routes: {
					info: function () { return can.route.url({page: 'profile', view: 'info'}, false) },
					activities: function () { return can.route.url({page: 'profile', view: 'activities'}, false) },
					earnpoints: function () { return can.route.url({page: 'profile', view: 'earnpoints'}, false) }
				}
			}
		}, {
			init : function (elem, opts) {
				elem.html( initView({
					routes: this.options.routes
				}) );
				
				this.initControl(can.route.attr('view'), opts);
			},

			'{can.route} view' : function (fn, ev, newVal, oldVal) {
				this.initControl(newVal);
			},

			'{can.route} page': function(route, ev, newVal, oldVal) {
				if (newVal != ' profile') currentControl = null;
			},
			
			'{currentUser} isLoggedIn' : function (fn, ev, newVal, oldVal) {
				if (newVal == false) can.route.attr({'page': 'homepage', 'view': 'latest'});
			},

			initControl : function (currentView) {
				var control = this.options.views[currentView];

				if( currentControl == control ) {
					return;
				} else {
					currentControl = control;
				}

				var	$div = $('<div/>');

				//new control($div, this.options);
				//this.element.html($div);
				new control(this.element.find('.profileContainer'), this.options)
			}
			
		});
	}
);
