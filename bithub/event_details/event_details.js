steal(
	'can',
	'bithub/models/event.js',
	'./event_details.mustache!',
	'bithub/homepage/event_list/determine_event_partial.js',	
	'bithub/homepage/event_list/handlers',	
	'bithub/helpers/mustacheHelpers.js',
	function(can, Event, eventDetailsView, determineEventPartial, EventHandlers){

		return can.Control.extend({
			defaults : {}
		}, {
			init : function( elem, opts ){
				var date;
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
					}, {
						entityComponent : function(events, date){

							if(typeof events.length === 'undefined'){
								events = [events];
							}

							return can.map(events, function(event){
								var component = determineEventPartial(event.attr('tags')),
									template = '<{c} currentdate="date" event="event" data="data"></{c}>';

								return can.view.mustache(can.sub(template, {c: component})).render({
									data  : data,
									date  : date,
									event : event
								});

							}).join('')
						}
					}));
				});

				new EventHandlers(this.element, opts);
			}

		});
	}
);
