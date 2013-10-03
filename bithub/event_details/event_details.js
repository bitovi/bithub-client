steal(
	'can',
	'bithub/models/event.js',
	'./event_details.ejs',
	'bithub/homepage/event_list/determine_event_partial.js',
	'bithub/homepage/event_list/views/_event_children.ejs',
	'bithub/homepage/event_list/views/_event_child_event.ejs',
	'bithub/homepage/event_list/views/_manage_bar.ejs',	
	'bithub/homepage/event_list/handlers',	
	'bithub/helpers/ejsHelpers.js',
	function(can, Event, eventDetailsView, determineEventPartial, eventChildrenPartial, eventChildEventPartial, manageBarPartial, EventHandlers){

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

				var partials = {						
					determineEvent: determineEventPartial,
					eventChildren: eventChildrenPartial,
					eventChildEvent: eventChildEventPartial,
					manageBar: manageBarPartial
				}

				Event.findOne({ id: can.route.attr('id') }, function( event ) {
					elem.html( eventDetailsView({
						event: event,
						data: data,
						partials: partials
					}) );
				});

				new EventHandlers(this.element, opts);
			}

		});
	}
);
