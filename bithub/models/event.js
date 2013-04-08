steal(
	'can',
	'ui/groupby.js',
	function (can) {
		return can.Model({
			init: function () {},

			// CRUD
			findAll : 'GET /api/events',
			findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events',
			update  : 'PUT /api/events/{id}',
			destroy : 'DELETE /api/events/{id}'

		}, {});
	});
