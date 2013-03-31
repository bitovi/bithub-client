steal(
	'can',
	function (can) {
		return can.Model({
			findAll : 'GET /api/events',
			findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events',
			update  : 'PUT /api/events/{id}',
			destroy : 'DELETE /api/events/{id}'
		}, {});		
	});
