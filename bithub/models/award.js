steal(
	'can',
	'can/construct/proxy',
	'can/construct/super',
	function (can) {
		return can.Model('Bithub.Models.Award', {
			init: function () {},

			//findAll : 'GET /api/events',
			//findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events/{event.id}/award'
			//update  : 'PUT /api/events/{id}',
			//destroy : 'DELETE /api/events/{id}'

		}, {
			award: function() {
				return this.save().done(this.proxy( 'awardEvent' ));
			},
			awardEvent: function( data ) {
				this.event.attr({
					'props.awarded_value': data.value,
					'props.thread_awarded': true
				});
			}
		});
	});
