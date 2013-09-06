steal(
	'can',
	'can/observe/list',
	'vendor/moment',
	function (can) {
		
		var Model = can.Model('Bithub.Models.Achievement', {

			findAll : 'GET /api/achievements',
			findOne : 'GET /api/achievements/{id}',
			create  : 'POST /api/achievements',
			update  : 'PUT /api/achievements/{id}',
			destroy : 'DELETE /api/achievements/{id}'

		}, {});
		
		return Model;
	});
