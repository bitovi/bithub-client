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
			destroy : 'DELETE /api/events/{id}',

			// Custom requests

			// Get latest events grouped by date and category
			latest: function(params, success, error) {
				params ? params['order'] = 'origin_ts:desc' : params = {order: 'origin_ts:desc'};
				$.ajax(
					{
						url: '/api/events/',
						type: 'GET',
						data: params,
						dataType: 'json'
					})
					.done(function (data) {
						// convert response to model instances and do the grouping
						success( $.groupBy( can.Model.models(data['data']), ['origin_date', 'category'] ) );
					})
					.fail(error);
			},

			// Get greatest events (sorted by points)
			greatest: function(params, success, error) {
				params = params || {};
				//params['order'] = params['order'] || 'points:desc';

				$.ajax(
					{
						url: '/api/events/',
						type: 'GET',
						data: params,
						dataType: 'json'
					})
					.done(function (data) {
						// return list of model instances
						success( can.Model.models(data['data']) );
					})
					.fail(error);
			}

		}, {});
	});
