steal('can',
		function (can) {
			return can.Model('Bithub.Models.Funnel', {

				// CRUD
				findAll : 'GET /api/v2/funnels',
				findOne : 'GET /api/v2/funnels/{id}',
				create  : 'POST /api/v2/funnels',
				update  : 'PUT /api/v2/funnels/{id}',
				destroy : 'DELETE /api/v2/funnels/{id}'

			}, {});
		});
