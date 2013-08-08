steal(
	'can',
	'bithub/navigator/filterbar',
	'bithub/navigator/admin_navbar',
	'bithub/helpers/permission_checker.js',
	function(can, Filterbar, AdminNavbar, pc){

		var delay = function (fn) {
			setTimeout(fn, 0);
		}

		return can.Control.extend('Bithub.Controls.Navigator', {
			defaults : { },
			pluginName: 'navigator'
		}, {

			init: function (el, opts) {
				this.initControl(can.route.attr('page'));
			},

			'{can.route} page': function (route, ev, newVal, oldVal) {
				this.initControl(newVal);
			},

			initControl: function (currentPage) {
				var control, className, $div = $('<div/>');

				if (currentPage === 'admin') control = AdminNavbar
				else control = Filterbar;

				if (!pc.hasPermissions(this.options.currentUser, control)) {
					new Filterbar($div, this.options);
					this.element.html($div);
				} else {
					new control($div, this.options);
					this.element.html($div);
				}
			},

			'{currentUser} loggedIn' : function () {
				delay(this.initControl(can.route.attr('page')));
			}

		});
	}
);
