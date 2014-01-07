steal(
	'can',
	'can/construct/proxy',
	'can/construct/super',
	function (can) {
		return can.Model('Bithub.Models.Award', {
			init: function () {},

			//findAll : 'GET /api/events',
			//findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events/{eventId}/award'
			//update  : 'PUT /api/events/{id}',
			//destroy : 'DELETE /api/events/{id}'

		}, {
			init : function(){
				this.attr('eventId', this.attr('event.id'));
			},
			award: function() {
				return this.save().done(this.proxy( 'awardEvent' ));
			},
			awardEvent: function( data ) {
				this.attr('event.props').attr({
					'awarded_value': data.value,
					'thread_awarded': true
				});
			}
		});
	});
