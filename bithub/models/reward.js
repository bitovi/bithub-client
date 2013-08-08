
steal(
	'can',
	function (can) {
		return can.Model('Bithub.Models.Reward', {

			findAll : 'GET /api/rewards',
			findOne : 'GET /api/rewards/{id}',
			create  : 'POST /api/rewards',
			update  : 'PUT /api/rewards/{id}',
			destroy : 'DELETE /api/rewards/{id}'

		}, {
			// NOP
		});
	});
