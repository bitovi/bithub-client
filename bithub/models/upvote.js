steal(
	'can',
	'can/construct/proxy',
	'can/construct/super',
	function (can) {
		return can.Model({
			init: function () {},

			//findAll : 'GET /api/events',
			//findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events/{event.id}/upvote'
			//update  : 'PUT /api/events/{id}',
			//destroy : 'DELETE /api/events/{id}'

		}, {
			upvote: function () {
				return this.save().done(this.proxy( 'sum_upvotes' ));
			},
			sum_upvotes: function () {
				this.event.attr('upvotes', this.event.attr('upvotes') + 1);
			}
		});
	});
