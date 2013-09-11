steal(
	'can',
	'./init.mustache',
	'./navbar.mustache',
	'bithub/profile/info',
	'bithub/profile/activities',
	'bithub/profile/earnpoints',
	'bithub/profile/rewards',
	function(can, initView, navbarView, ProfileInfoControl, ProfileActivitiesControl, EarnPointsControl, RewardsControl){

		var currentControl;
		
		return can.Control.extend({
			pluginName: 'profile',
			defaults : {
				views: {
					info: ProfileInfoControl,
					activities: ProfileActivitiesControl,
					earnpoints: EarnPointsControl,
					rewards: RewardsControl
				},
				routes: {
					info: function () { return can.route.url({page: 'profile', view: 'info'}, false) },
					activities: function () { return can.route.url({page: 'profile', view: 'activities'}, false) },
					rewards: function () { return can.route.url({page: 'profile', view: 'rewards'}, false) },
					earnpoints: function () { return can.route.url({page: 'profile', view: 'earnpoints'}, false) }
				}
			}
		}, {
			init : function (elem, opts) {

				$('#profile-navbar').html( navbarView({
					routes: this.options.routes,
					user: this.options.currentUser
				}, {
					helpers: {
						isProfilePage: function( opts ) {
							return can.route.attr('page') == 'profile' ? opts.fn(this) : opts.inverse(this);
						},
						isActive: function( view, opts ) {
							return can.route.attr('view') == view ? "active" : "";
						}
					}
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

				new control($div, this.options);
				this.element.html($div);
			}
			
		});
	}
);
