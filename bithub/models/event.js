steal(
	'can',
	'./upvote.js',
	'can/model/list',
	'ui/groupby.js',
	function (can, Upvote) {
		var Event = can.Model('Bithub.Models.Event', {
			init: function () {},

			findAll : 'GET /api/events',
			findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events',
			update  : 'PUT /api/events/{id}',
			destroy : 'DELETE /api/events/{id}'

		}, {
			upvote: function (success, error) {
				(new Upvote({event: this})).upvote();
			},
			award_sum: function () {
				return this.award + this.attr('upvotes') + this.attr('anteups');
			}
		});

		can.Model.List('Bithub.Models.Event.List', {
			latest: function () {
				return $.groupBy( this, ['origin_date', 'category'] );
			}
		});
		
		return Event;
	});
