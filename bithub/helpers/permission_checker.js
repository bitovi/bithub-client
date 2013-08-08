steal(
	'vendor/lodash',
	function () {
		return {
			needsPermissions: function(control) {
				return _.has(control, 'requiredPermissions') && !(_.isEmpty(control.requiredPermissions));
			},

			hasPermissions: function(user, control) {
				if (!this.needsPermissions(control)) {
					return true;
				} else {
					return _.has(user, 'roles') && _.isEqual(_.intersection(control.requiredPermissions, user.roles), control.requiredPermissions);
				}
			}

		}
	}
);
