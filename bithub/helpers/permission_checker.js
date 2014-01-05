steal(
	'vendor/lodash',
	function () {
		return {
			needsPermissions: function(control) {
				return _.has(control, 'requiredPermissions') && !(_.isEmpty(control.requiredPermissions));
			},

			hasPermissions: function(user, control) {
				var roles;
				if (!this.needsPermissions(control)) {
					return true;
				} else {
					roles = user.attr('roles') || [];
					return _.isEqual(_.intersection(control.requiredPermissions, roles), control.requiredPermissions);
				}
			}

		}
	}
);
