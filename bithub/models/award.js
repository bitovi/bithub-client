steal(
	'can',
	'can/construct/proxy',
	'can/construct/super',
	function (can) {
		return can.Model('Bithub.Models.Award', {
			init: function () {},

			//findAll : 'GET /api/events',
			//findOne : 'GET /api/events/{id}',
			create  : 'POST /api/v1/events/{eventId}/award'
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
				var event = this.attr('event'),
					parentId = event.attr('parent_id'),
					parent = event.constructor.store && event.constructor.store[parentId];

				event.attr('props').attr({
					'awarded_value': data.value,
					'thread_awarded': true
				});

				if(parent){
					can.map(parent.attr('children'), function(child){
						child.attr('props.thread_awarded', true);
					})
				}
			}
		});
	});
