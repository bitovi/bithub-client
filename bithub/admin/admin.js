steal(
	'can',
	'bithub/helpers/fun_helpers.js',
	'bithub/admin/users',
	'bithub/admin/rewards',
	'bithub/admin/tags',
	function(can, f, UsersControl, RewardsControl, TagsControl){

		return can.Control.extend('Bithub.Controls.Admin', {
			requiredPermissions: ['admin'],
			defaults : {
				views: {
					users: UsersControl,
					rewards: RewardsControl,
					tags: TagsControl
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
