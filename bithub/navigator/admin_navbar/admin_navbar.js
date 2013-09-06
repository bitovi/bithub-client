steal(
	'can',
	'ui/radio_selector',
	function(can, RadioSelector){

		return can.Control.extend('Bithub.Controls.Navigator.AdminNavbar', {
			pluginName: 'admin-navbar',
			requiredPermissions: ['admin'],
			defaults : {
				state: function (newVal) {
					return can.route.attr('view');
				},
				items: [{
					name: 'users',
					url: function () { return can.route.url({page: 'admin', view: 'users', action: 'list'}, false) },
					display_name: 'Users'
				}, {
					name: 'tags',
					url: function () { return can.route.url({page: 'admin', view: 'tags', action: 'list'}, false) },
					display_name: 'Tags'
				}, {
					name: 'rewards',
					url: function () { return can.route.url({page: 'admin', view: 'rewards', action: 'list'}, false) },
					display_name: 'Rewards'
				}, {
					name: 'achievements',
					url: function () { return can.route.url({page: 'admin', view: 'achievements', action: 'list'}, false) },
					display_name: 'Achievements'
				}]
			}
		}, {
			init : function(element, options) {
				var $ul = $('<ul/>').addClass('nav');
				new RadioSelector($ul, this.options);
				element.html($ul);
			}
		});
	}
);
