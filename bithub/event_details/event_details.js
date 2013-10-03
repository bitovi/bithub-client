steal(
	'can',
	'bithub/models/event.js',
	'./event_details.ejs',
	'bithub/homepage/event_list/event_partials.js',	
	'bithub/homepage/event_list/handlers',	
	'bithub/helpers/ejsHelpers.js',
	function(can, Event, eventDetailsView, eventPartials, EventHandlers){

		return can.Control.extend({
			defaults : {}
		}, {
			init : function( elem, opts ){

				var data = {
					user: opts.currentUser,					
					projects: opts.projects,
					categories: opts.categories,
					visibleTags: opts.visibleTags
				}

				Event.findOne({ id: can.route.attr('id') }, function( event ) {
					elem.html( eventDetailsView({
						event: event,
						data: data,
						partials: eventPartials
					}) );
				});

				new EventHandlers(this.element, opts);
			}

		});
	}
);
