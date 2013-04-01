steal(
	'can',
	function (can) {
		return can.Model({
			init: function () {},

			// CRUD
			findAll : 'GET /api/users',
			findOne : 'GET /api/users/{id}',
			create  : 'POST /api/users',
			update  : 'PUT /api/users/{id}',
			destroy : 'DELETE /api/users/{id}',

			// Custom requests

			// Get leaderboard
			leaderboard: function(params, success, error) {
				params = params || {};
				//params['order'] = params['order'] || 'score:desc';
				//params['limit'] = params['order'] || 6;
				
				$.ajax(
					{
						url: '/api/users/',
						type: 'GET',
						data: params,
						dataType: 'json'
					})
					.done(success)
					.fail(error);
			}

		}, {});
	});
