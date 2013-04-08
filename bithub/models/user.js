steal(
	'can',
	'../helpers/auth.js',
	function (can, auth) {
		return can.Model({
			init: function () {

			},

			// CRUD
			findAll : 'GET /api/users',
			findOne : 'GET /api/users/{id}',
			create  : 'POST /api/users',
			update  : 'PUT /api/users/{id}',
			destroy : 'DELETE /api/users/{id}'

		}, {
			fromSession: function() {
				var self = this;
				can.ajax({
					url: '/api/session',
					type: 'GET'
				}).done(function(data) {
					self.attr(can.Model.model(data).attr());
					self.attr('loggedIn', true);
					can.trigger(self, 'loggedin');
				}).fail(function(response) {
					console.error(response);
				});
			},
			login: function(options) {
				auth.login.apply(this, arguments);
			},
			logout: function() {
				auth.logout();
			}
		});
	});
