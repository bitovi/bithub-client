steal(
	'can',
	'./event_details.mustache',
	function(can, eventDetailsView){

		return can.Control.extend({
			defaults : {}
		}, {
			init : function( elem, opts ){
				
				Bithub.Models.Event.findOne({ id: can.route.attr('id') }, function(event) {
					elem.html( eventDetailsView({
						event: event
					}));
				});
				
			}

		});
	}
);
