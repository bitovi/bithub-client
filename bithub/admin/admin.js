steal(
	'can',
	'bithub/helpers/fun_helpers.js',
	'bithub/admin/users',
	'bithub/admin/rewards',
	'bithub/admin/tags',
	'bithub/admin/achievements',
	function(can, f, UsersControl, RewardsControl, TagsControl, AchievementsControl){

		return can.Control.extend('Bithub.Controls.Admin', {
			requiredPermissions: ['admin'],
			defaults : {
				views: {
					users: UsersControl,
					rewards: RewardsControl,
					tags: TagsControl,
					achievements: AchievementsControl
				}
			},
			pluginName : 'admin'
		}, {
			init: function(element, opts) {
				this.initControl(can.route.attr('view'));
			},

			'{can.route} view': function( route, ev, newVal, oldVal ) {
				this.initControl(newVal);
			},

			initControl: function(currentView) {
				var control = this.options.views[currentView],
					$div = $('<div/>');

				new control($div, this.options);
				this.element.html($div);
			}
		});
	}
);
