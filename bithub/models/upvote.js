steal(
	'can',
	'can/construct/proxy',
	'can/construct/super',
	function (can) {
		return can.Model('Bithub.Models.Upvote', {
			init: function () {},

			//findAll : 'GET /api/events',
			//findOne : 'GET /api/events/{id}',
			create    : 'POST /api/events/{event.id}/upvote'
			//update  : 'PUT /api/events/{id}',
			//destroy : 'DELETE /api/events/{id}'

		}, {
			upvote: function () {
				var self = this,
					timer;

				clearTimeout(timer);				
				timer = setTimeout(function() {
					// updates DOM immediately, then wait for response and reduce on failure
					self.sum_upvotes();
					return self.save().fail( function() { self.sum_upvotes(-1) } );
				}, 0);
			},
			sum_upvotes: function ( value ) {
				value = value || 1;
				this.event.attr('upvotes', this.event.attr('upvotes') + value);
			}
		});
	});
