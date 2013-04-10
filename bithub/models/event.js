steal(
	'can',
	'ui/groupby.js',
	function (can) {
		return can.Model({
			init: function () {},

			findAll : 'GET /api/events',
			findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events',
			update  : 'PUT /api/events/{id}',
			destroy : 'DELETE /api/events/{id}'

		}, {
			upvote: function (success, error) {
				can.ajax({
					url: '/api/events/' + this.id + '/upvote/',
					type: 'POST'
				}).done(success).fail(error);				
			},
			award_sum: function () {
				return this.award + this.attr('upvotes') + this.attr('anteups');
			}
		});
	});
