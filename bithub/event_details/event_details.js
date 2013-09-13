steal(
	'can',
	'bithub/models/event.js',
	'./event_details.ejs',

	'bithub/homepage/event_list/determine_event_partial.js',
	'bithub/homepage/event_list/views/_event_children.ejs',

	'bithub/helpers/ejsHelpers.js',
	function(can, Event, eventDetailsView, determineEventPartial, eventChildrenPartial){

		return can.Control.extend({
			defaults : {}
		}, {
			init : function( elem, opts ){

				var ejsHelpers = {
					isAdmin: function () {
						return opts.currentUser.isAdmin();
					},
					isLoggedIn: function () {
						return opts.currentUser.isLoggedIn();
					},
					formatTs: function( event ) {
						return can.EJS.Helpers.prototype.prettifyTs( event.attr('origin_ts'), 'datetime' );
					},
					getAuthorName: function( event ) {
						return event.attr('author.name') || event.attr('props.origin_author_name') || '';
					},
					eventUrl: function( event ) {
						if (event.attr('url')) {
							return "<a href=\"" + event.attr('url') + "\">" + event.attr('title') + "</a>";
						} else {
							return "<a>" + event.attr('title') + "</a>";
						}
					}
				};

				Event.findOne({ id: can.route.attr('id') }, function( event ) {
					elem.html( eventDetailsView({
						event: new can.LazyMap(event),
						visibleTags: opts.visibleTags,
						user: opts.currentUser,
						determineEventPartial: determineEventPartial,
						eventChildrenPartial: eventChildrenPartial,
						ejsHelpers: ejsHelpers
					}, ejsHelpers) );
				});
				
			}

		});
	}
);
