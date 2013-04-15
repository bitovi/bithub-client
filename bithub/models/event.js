steal(
	'can',
	'./upvote.js',
	'bithub/helpers/group.js',
	'can/model/list',
	function (can, Upvote, helpers) {
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
				this.attr('length');

				// group events by 'origin_date' into array of days
				var days = helpers.groupIntoArray( this, ['origin_date'] );

				// then for every day group events by 'category' into object with categories as keys
				$.each( days, function(i, day) {
					day.value = helpers.groupIntoObject( day.value, ['category'] );
				});

				return days;				
			}
		});
		
		return Event;
	});
